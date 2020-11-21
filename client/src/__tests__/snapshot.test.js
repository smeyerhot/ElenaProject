import React from 'react'
import renderer from 'react-test-renderer'
import Index from '../pages/index'
import map from '../components/map'

it('renders homepage unchanged', () => {
  const tree = renderer.create(<Index />).toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders route', () => {
  const tree = renderer.create(<map/>).toJSON()
  expect(tree).toMatchSnapshot()
})