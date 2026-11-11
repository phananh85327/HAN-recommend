// Demo scenarios: real customers and products of the rebuilt Amazon-Meta data, chosen so the lists
// are easy to judge. Edit freely; nothing else depends on them.

export const K_OPTIONS = [5, 10, 20]
export const DEFAULT_K = 10

export const DEMO_USERS = [
  {
    id: 'A29SHMCIJG2NSO',
    title: 'Niche taste: C++ / Windows programmer',
    note: '9 books: Modern C++ Design, Effective STL, Inside COM. Good next picks: Effective C++, ' +
      'The C++ Programming Language, Design Patterns.',
  },
  {
    id: 'AVGX4BYF7J559',
    title: 'Niche taste: anime fan',
    note: '11 DVDs and videos: Sailor Moon, Outlaw Star, Dragon Ball Z. Good next picks: more Sailor ' +
      'Moon, Cowboy Bebop.',
  },
  {
    id: 'A3FF936V6MPPDI',
    title: 'Easy case: 90s hip-hop',
    note: '9 CDs: Ready to Die, Reasonable Doubt, It Was Written. Good next picks: Illmatic, ' +
      'The Blueprint, Enter the Wu-Tang.',
  },
  {
    id: 'A9FDQDNCN2O7H',
    title: 'Mixed media: fantasy books and films',
    note: '14 items in all four groups: Harry Potter, A Game of Thrones, Signs. Do books and films ' +
      'both show up?',
  },
  {
    id: 'A2Z7PA4C4Q3JB0',
    title: 'Thin profile: 5 reviews, the minimum',
    note: '4 fantasy books and one Metallica album: which taste does each model follow?',
  },
  {
    id: 'A82LIVYSX6WZ9',
    title: 'Heavy reviewer: film buff',
    note: '269 DVDs and videos, all left out of the lists.',
  },
]

export const DEMO_PRODUCTS = [
  {
    asin: '0590353403',
    title: "Series: Harry Potter and the Sorcerer's Stone",
    note: 'Look for the other Harry Potter books and the films.',
  },
  {
    asin: '0201924889',
    title: 'Niche book: Effective C++',
    note: 'Its also-bought list: Design Patterns, The C++ Programming Language, More Effective C++, ' +
      'Exceptional C++.',
  },
  {
    asin: '1556227043',
    title: "Long tail: Developer's Workshop to COM and ATL 3.0",
    note: 'Only 5 reviewers: the hardest case.',
  },
  {
    asin: 'B000002UB2',
    title: 'Easy album: Abbey Road',
    note: 'Other Beatles albums should top every list.',
  },
  {
    asin: '158788772X',
    title: 'Book with a film: The Godfather',
    note: "Puzo's other novels, or the films?",
  },
]
