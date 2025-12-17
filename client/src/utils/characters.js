// RPG Character sprites with 12 different characters
// Based on the attached character images (warriors, mages, ninjas, dragons)

export const RPG_CHARACTERS = [
  { id: 1, emoji: '🧙‍♂️', name: 'Wizard', color: 'from-purple-500 to-indigo-600' },
  { id: 2, emoji: '⚔️', name: 'Knight', color: 'from-gray-400 to-gray-600' },
  { id: 3, emoji: '🧙‍♀️', name: 'Sorceress', color: 'from-pink-400 to-purple-500' },
  { id: 4, emoji: '🥷', name: 'Ninja', color: 'from-gray-700 to-black' },
  { id: 5, emoji: '🐉', name: 'Dragon Green', color: 'from-green-400 to-green-600' },
  { id: 6, emoji: '🐲', name: 'Dragon Purple', color: 'from-purple-400 to-purple-700' },
  { id: 7, emoji: '🦎', name: 'Dragon Brown', color: 'from-yellow-700 to-brown-800' },
  { id: 8, emoji: '🤴', name: 'Prince', color: 'from-yellow-400 to-orange-500' },
  { id: 9, emoji: '👸', name: 'Princess', color: 'from-pink-300 to-pink-500' },
  { id: 10, emoji: '🧛', name: 'Vampire', color: 'from-red-600 to-red-900' },
  { id: 11, emoji: '🧝', name: 'Elf', color: 'from-green-300 to-green-500' },
  { id: 12, emoji: '🧚', name: 'Fairy', color: 'from-cyan-300 to-blue-400' },
];

// Get random character from the list
export function getRandomCharacter(excludeIds = []) {
  const available = RPG_CHARACTERS.filter(char => !excludeIds.includes(char.id));
  return available[Math.floor(Math.random() * available.length)];
}

// Assign random characters to players
export function assignCharactersToPlayers(players) {
  const usedIds = [];
  return players.map(player => {
    const character = getRandomCharacter(usedIds);
    usedIds.push(character.id);
    return {
      ...player,
      character
    };
  });
}

// Get character by ID
export function getCharacterById(id) {
  return RPG_CHARACTERS.find(char => char.id === id) || RPG_CHARACTERS[0];
}
