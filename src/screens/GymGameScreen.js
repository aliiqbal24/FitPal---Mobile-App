import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Image, Alert, TouchableOpacity, Button, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPRITE = require('../../assets/AppSprite.png');
const SPRITE_SIZE = 120;

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Character = React.memo(({ body, onPress }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.character, { left: x, top: y, width, height }]}> 
      <Image source={SPRITE} style={styles.sprite} resizeMode="contain" />
    </TouchableOpacity>
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

  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);

  const addSet = useCallback(() => {
    setExp(e => e + 1);
  }, []);

  useEffect(() => {
    const newLevel = Math.floor(exp / 20) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [exp, level]);

  const stars = Math.min(5, 1 + Math.floor((level - 1) / 5));

  const showStats = useCallback(() => {
    Alert.alert('Stats', `EXP: ${exp}\nLevel: ${level}\nStars: ${'\u2B50'.repeat(stars)}`);
  }, [exp, level, stars]);

  const entities = {
    physics: { engine: engine.current, world },
    character: { body: characterBody, renderer: <Character body={characterBody} onPress={showStats} /> },
  };

  return (
    <SafeAreaView style={styles.container}>
      <GameEngine style={styles.engine} systems={[Physics]} entities={entities} />
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

