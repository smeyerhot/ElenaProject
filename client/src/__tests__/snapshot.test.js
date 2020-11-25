import React from 'react'
import renderer from 'react-test-renderer'
import PathSummary from '../components/pathsummary'

it('renders correctly when there are no items', () => {
  const tree = renderer.create(<PathSummary />).toJSON();
  expect(tree).toMatchSnapshot();
});