// @flow
import React from 'react'
import {Alert, StyleSheet} from 'react-native'
import {Markdown} from '../components/markdown'
import {ListFooter} from '../components/list'
import glamorous from 'glamorous-native'
import {phonecall} from 'react-native-communications'
import {tracker} from '../../analytics'
import {Button} from '../components/button'
import openUrl from '../components/open-url'
import type {ContactType} from './types'

const AAO_URL = 'https://github.com/carls-app/carls/issues/new'

const Title = glamorous.text({
  fontSize: 36,
  textAlign: 'center',
  marginHorizontal: 18,
  marginVertical: 10,
})

const Container = glamorous.scrollView({
  paddingHorizontal: 18,
  paddingVertical: 6,
})

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
  },
})

function formatNumber(phoneNumber: string) {
  const re = /(\d{3})-?(\d{3})-?(\d{4})/g
  return phoneNumber.replace(re, '($1) $2-$3')
}

function promptCall(buttonText: string, phoneNumber: string) {
  Alert.alert(buttonText, formatNumber(phoneNumber), [
    {text: 'Cancel', onPress: () => console.log('Call cancel pressed')},
    {text: 'Call', onPress: () => phonecall(phoneNumber, false)},
  ])
}

export class ContactsDetailView extends React.PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.contact.title,
    }
  }

  props: {navigation: {state: {params: {contact: ContactType}}}}

  onPress = () => {
    const {
      title,
      phoneNumber,
      buttonText,
      buttonLink,
    } = this.props.navigation.state.params.contact
    tracker.trackScreenView(`ImportantContacts_${title.replace(' ', '')}View`)
    if (buttonLink) {
      openUrl(buttonLink)
    } else if (phoneNumber) {
      promptCall(buttonText, phoneNumber)
    }
  }

  render() {
    const contact = this.props.navigation.state.params.contact
    return (
      <Container>
        <Title selectable={true}>{contact.title}</Title>

        <Markdown
          styles={{Paragraph: styles.paragraph}}
          source={contact.text}
        />

        <Button onPress={this.onPress} title={contact.buttonText} />

        <ListFooter
          title="Collected by the humans of CARLS"
          href={AAO_URL}
        />
      </Container>
    )
  }
}
