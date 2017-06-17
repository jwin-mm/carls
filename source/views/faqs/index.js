// @flow
import React from 'react'
import {WebView, StyleSheet} from 'react-native'
import * as c from '../components/colors'
import LoadingView from '../components/loading'
import {text as faqs} from '../../../docs/faqs.json'
import {tracker} from '../../analytics'
import bugsnag from '../../bugsnag'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: c.transparent,
  },
})

export class FaqView extends React.Component {
  static navigationOptions = {
    title: 'FAQs',
  }

  state = {
    html: faqs,
  }

  componentWillMount() {
    this.fetchData()
  }

  url = 'https://carls-app.github.io/CARLS/faqs.json'

  fetchData = async () => {
    let html = faqs
    try {
      let blob: {text: string} = await fetchJson(this.url)
      html = blob.text
    } catch (err) {
      html = faqs
      tracker.trackException(err.message)
      bugsnag.notify(err)
      console.warn(err.message)
    }

    if (process.env.NODE_ENV === 'development') {
      html = faqs
    }

    this.setState({html: html})
  }

  render() {
    if (!this.state.html) {
      return <LoadingView />
    }
    return <WebView style={styles.container} source={{html: this.state.html}} />
  }
}
