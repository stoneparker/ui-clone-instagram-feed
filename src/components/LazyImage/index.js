import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';

import { Small, Original } from './styles';

const OriginalAnimated = Animated.createAnimatedComponent(Original);

export default function LazyImage({
     smallSource,
     source,
     aspectRatio,
     shouldLoad
}) {

  const opacity = new Animated.Value(0); // valor inicial da opacidade
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (shouldLoad) {
      // setTimeout(() => {
        setLoaded(true); // mostrar a imagem original com delay para nao ter o efeito do armazenamento em cache APENAS PARA DESENVOLVIMENTO
      // }, 1000)
    }
  }, [shouldLoad]); // disprado toda a vez que o shouldLoad é alterado

  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true, // animação ocorra do lado nativo, não via JS
    }).start(); // iniciar a animação assim que ele for instanciado
  }

  return (
    <Small 
      source={smallSource} 
      ratio={aspectRatio} 
      resizeMode="contain" 
      blurRadius={1}
    >
      {loaded && <OriginalAnimated
        style={{ opacity }} 
        source={source} 
        ratio={aspectRatio}
        resizeMode="contain"
        onLoadEnd={handleAnimate}
      />}
    </Small>

  );
}
