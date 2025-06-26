import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Image, Alert, Button, Dimensions, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { SafeAreaView } from 'react-native-safe-area-context';
import TouchHandler from '../systems/TouchHandler';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTER_IMAGES } from '../data/characters';

const SPRITE_SIZE = 120;

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Character = React.memo(({ body, sprite, petName }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View style={[styles.character, { left: x, top: y, width, height }]}>
      {petName ? <Text style={styles.petName}>{petName}</Text> : null}
      <Image source={sprite} style={styles.sprite} resizeMode="contain" />
    </View>
  );
});

export default function GymGameScreen() {
  const engine = useRef(Matter.Engine.create({ enableSleeping: false }));
  const world = engine.current.world;
  const { width, height } = Dimensions.get('window');

  const characterBody = useRef(
    Matter.Bodies.rectangle(width / 2, height / 2, SPRITE_SIZE, SPRITE_SIZE, { isStatic: true })
  ).current;

  useEffect(() => {
    Matter.World.add(world, [characterBody]);
    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine.current);
    };
  }, [world, characterBody]);

  const { exp, level, addExp, characterId, petName } = useCharacter();
  const sprite = CHARACTER_IMAGES[characterId] || CHARACTER_IMAGES.GiraffeF;

  const addSet = useCallback(() => {
    addExp(1);
  }, [addExp]);

  const stars = Math.min(5, 1 + Math.floor((level - 1) / 5));

  const showStats = useCallback(() => {
    Alert.alert('Stats', `EXP: ${exp}\nLevel: ${level}\nStars: ${'\u2B50'.repeat(stars)}`);
  }, [exp, level, stars]);

  const entities = {
    physics: { engine: engine.current, world },
    character: { body: characterBody },
  };

  const onEvent = useCallback(
    e => {
      if (e.type === 'show-stats') {
        showStats();
      }
    },
    [showStats]
  );

  return (
    <SafeAreaView style={styles.container}>
      <GameEngine
        style={styles.engine}
        systems={[Physics, TouchHandler]}
        entities={entities}
        onEvent={onEvent}
      >
        <Character body={characterBody} sprite={sprite} petName={petName} />
      </GameEngine>
      <View style={styles.buttonContainer}>
        <Button title="+ Set" onPress={addSet} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  engine: {
    flex: 1,
  },
  character: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petName: {
    position: 'absolute',
    top: -20,
    fontWeight: '700',
    color: '#222',
  },
  sprite: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});

