export const CHARACTER_IMAGES = {
  GorillaF: require('../../assets/characters/GorillaF.png'),
  GorillaM: require('../../assets/characters/GorillaM.png'),
};

export const CHARACTER_OPTIONS = Object.keys(CHARACTER_IMAGES).map(key => ({
  id: key,
  image: CHARACTER_IMAGES[key],
}));
