import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const TAB_ORDER = ['Profile', 'Gym', 'History', 'Login'];

export default function useSwipeTabs(order = TAB_ORDER) {
  const navigation = useNavigation();
  const route = useRoute();

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        const { dx, dy } = gesture;
        return Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderRelease: (_, gesture) => {
        const { dx } = gesture;
        const currentIndex = order.indexOf(route.name);
        if (dx < -50 && currentIndex < order.length - 1) {
          navigation.navigate(order[currentIndex + 1]);
        } else if (dx > 50 && currentIndex > 0) {
          navigation.navigate(order[currentIndex - 1]);
        }
      },
    })
  ).current;

  return responder.panHandlers;
}
