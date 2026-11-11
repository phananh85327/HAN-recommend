import { describe, expect, it, vi } from 'vitest'
import { ApiError, api, query } from './api.js'
import { mockApi } from './test/mockApi.js'

describe('query', () => {
  it('writes "+" as %2B, so "c++" is not read as "c  "', () => {
    expect(query({ q: 'effective c++' })).toBe('?q=effective+c%2B%2B')
  })
  it('leaves out empty values', () => {
    expect(query({ a: '', b: null, c: undefined, d: 0, e: false })).toBe('?d=0&e=false')
    expect(query({})).toBe('')
  })
})

describe('api', () => {
  it('asks for several models in one request', async () => {
    const calls = mockApi([[/recommendations$/, () => [200, { results: [] }]]])
    await api.recommendations('A29SHMCIJG2NSO', { models: ['a_s1', 'b_s1'], k: 20, excludeSeen: false })
    const url = calls[0]
    expect(url.pathname).toBe('/api/users/A29SHMCIJG2NSO/recommendations')
    expect(url.searchParams.get('models')).toBe('a_s1,b_s1')
    expect(url.searchParams.get('k')).toBe('20')
    expect(url.searchParams.get('exclude_seen')).toBe('false')
  })

  it('passes on the API\'s own error message', async () => {
    mockApi([[/^\/api\/users\/NOBODY$/, () => [404, { error: "user 'NOBODY' not found" }]]])
    await expect(api.user('NOBODY')).rejects.toMatchObject({ status: 404, message: "user 'NOBODY' not found" })
  })

  it('says how to start the API when it cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }))
    const error = await api.health().catch(e => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toMatch(/recommend_api\.bat/)
  })

  it('treats a non-JSON error (the dev proxy with the API down) as the API not answering', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false, status: 502, json: async () => { throw new SyntaxError('not JSON') },
    })))
    await expect(api.models()).rejects.toThrow(/HTTP 502.*recommend_api\.bat/)
  })
})
