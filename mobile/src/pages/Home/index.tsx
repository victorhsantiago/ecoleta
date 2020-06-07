import React, { useState } from 'react'
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import logo from '../../assets/logo.png'
import homeBackground from '../../assets/home-background.png'

const Home = () => {
  const [state, setState] = useState<string>()
  const [city, setCity] = useState<string>()

  const { navigate } = useNavigation()

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={homeBackground}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coletas de forma
              eficientes.
            </Text>
          </View>
        </View>

        <View>
          <TextInput
            placeholder="Digite o estado"
            style={styles.input}
            onChangeText={setState}
          />
          <TextInput
            placeholder="Digite a cidade"
            style={styles.input}
            onChangeText={setCity}
          />
          <RectButton
            style={styles.button}
            onPress={() => navigate('Points', { state, city })}
          >
            <View style={styles.buttonIcon}>
              <Icon name="log-in" color="#FFF" size={24}></Icon>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
})
export default Home
