// @flow
import React, {PropTypes} from 'react'
import {
  StyleSheet,
  View,
  ListView,
  Text,
  Navigator,
  TouchableOpacity,
} from 'react-native'

import type {StoryType} from './types'
import LoadingView from '../components/loading'
import * as c from '../components/colors'

let Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

import NewsItemView from './news-item'

export default class NewsContainer extends React.Component {
  static propTypes = {
    navigator: PropTypes.instanceOf(Navigator).isRequired,
    url: PropTypes.string.isRequired,
  }

  state = {
    dataSource: null,
    loaded: false,
    error: false,
  }

  componentWillMount() {
    this.fetchData()
  }

  rowHasChanged(r1: StoryType, r2: StoryType) {
    return r1.title != r2.title
  }

  async fetchData() {
    let ds = new ListView.DataSource({
      rowHasChanged: this.rowHasChanged,
    })

    try {
      let response = await fetch(this.props.url)
      let responseJson = await response.json()
      this.setState({dataSource: ds.cloneWithRows(responseJson.responseData.feed.entries)})
    } catch (error) {
      this.setState({error: true})
      console.error(error)
    }
    this.setState({loaded: true})
  }

  renderRow(story: StoryType) {
    let title = entities.decode(story.title)
    let snippet = entities.decode(story.contentSnippet)
    return (
      <TouchableOpacity onPress={() => this.onPressNews(title, story)}>
        <View style={styles.rowContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemPreview}>{snippet}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  onPressNews(title, story: StoryType) {
    this.props.navigator.push({
      id: 'NewsItemView',
      title: title,
      component: <NewsItemView
        story={story}
        title={title}
        navigator={this.props.navigator}
      />,
    })
  }

  render() {
    if (this.state.dataSource === null) {
      return <LoadingView />
    }

    return (
      <ListView
        style={styles.listContainer}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    )
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 50,
    backgroundColor: '#ffffff',
  },
  rowContainer: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  itemTitle: {
    color: c.black,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 3,
    fontSize: 16,
    textAlign: 'left',
  },
  itemPreview: {
    color: c.iosText,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 6,
    fontSize: 13,
    textAlign: 'left',
  },
})
