import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Linking,
} from 'react-native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import Constants from 'expo-constants'
import * as MailComposer from 'expo-mail-composer'

import api from '../../services/api'

interface RouteParams {
  pointId: number
}

interface Point {
  name: string
  email: string
  whatsapp: string
  image: string
  image_url: string
  city: string
  state: string
  items: {
    title: string
    image_url: string
  }[]
}

const Detail = () => {
  const { goBack } = useNavigation()

  const { pointId } = useRoute().params as RouteParams

  const [point, setPoint] = useState<Point>({} as Point)

  useEffect(() => {
    api.get(`points/${pointId}`).then(({ data }) => setPoint(data))
  }, [])

  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${point.whatsapp}&text=Olá, tenho interesse sobre coleta de resíduos.`
    )
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      recipients: [point.email],
      subject: 'Coleta de resíduos',
    })
  }

  if (!Object.keys(point).length) return null

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => goBack()}>
          <Icon name="arrow-left" color="#34cb79" size={20}></Icon>
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: point.image_url,
          }}
        />
        <Text style={styles.pointName}>{point.name}</Text>
        {point.items.map((item) => (
          <Text key={item.title} style={styles.pointItems}>
            {item.title}
          </Text>
        ))}

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço:</Text>
          <Text style={styles.addressContent}>
            {point.city}, {point.state}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText} onPress={() => {}}>
            Whatsapp
          </Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText} onPress={() => {}}>
            E-mail
          </Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
})

export default Detail
