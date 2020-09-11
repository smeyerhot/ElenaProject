import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Index from '../pages/index'

test('renders deploy link', () => {
//   const { getByText } = render(<Index />)
  const { getByText } = render(<Fetch url="/signin" />)
    fireEvent.click(screen.getByText("Hello"))
  const linkElement = getByText(
    
  )
  expect(linkElement).toBeInTheDocument()
})