export const CHARACTER_IMAGES = {
  GorillaF: require('../../assets/characters/GorillaF.png'),
  GorillaF2: require('../../assets/characters/GorillaF2.png'),
  GorillaF3: require('../../assets/characters/GorillaF3.png'),
  GorillaM: require('../../assets/characters/GorillaM.png'),
  GorillaM2: require('../../assets/characters/GorillaM.png'),
};

export const CHARACTER_OPTIONS = Object.keys(CHARACTER_IMAGES).map(key => ({
  id: key,
  image: CHARACTER_IMAGES[key],
}));
