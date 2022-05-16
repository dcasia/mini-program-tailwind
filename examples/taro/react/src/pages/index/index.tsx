import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.css'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={`index bg-[#b5b5b5] h-screen pl-7.5 ${true ? 'text-[50px]' : ''}`}>
        <Text className={`${'none'} font-bold text-[#ffffff]`}>Hello world!</Text>
      </View>
    )
  }
}
