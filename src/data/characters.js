export const CHARACTER_IMAGES = {
  GiraffeF: require('../../assets/characters/GiraffeF.png'),
  GiraffeM: require('../../assets/characters/GiraffeM.png'),
  GorillaF: require('../../assets/characters/GorillaF.png'),
  GorillaM: require('../../assets/characters/GorillaM.png'),
  OwlF: require('../../assets/characters/OwlF.png'),
  OwlM: require('../../assets/characters/OwlM.png'),
};

export const CHARACTER_OPTIONS = Object.keys(CHARACTER_IMAGES).map(key => ({
  id: key,
  image: CHARACTER_IMAGES[key],
}));
