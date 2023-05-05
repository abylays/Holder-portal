import React from "react";
import {render} from '@testing-library/react';
import NotFound from './NotFound'

describe('Test NotFound component', ()=>{
    test('NotFound component can render', ()=>{
        const { queryByRole } = render(<NotFound />);
        expect(queryByRole('heading', {level: 3, name: 'Sorry, page not found!'})).toBeTruthy();
    })
})