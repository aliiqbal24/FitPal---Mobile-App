export const CHARACTER_IMAGES = {
  Gorilla1: require('../../assets/characters/gorilla1.png'),
  GorillaM2: require('../../assets/characters/gorillaM2.png'),
  GorillaM3: require('../../assets/characters/GorillaM3.png'),
  GorillaF2: require('../../assets/characters/GorillaF2.png'),
  GorillaF3: require('../../assets/characters/GorillaF3.png'),
};

export const CHARACTER_OPTIONS = Object.keys(CHARACTER_IMAGES).map(key => ({
  id: key,
  image: CHARACTER_IMAGES[key],
}));
