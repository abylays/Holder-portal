import React from 'react'
import { render } from '@testing-library/react';
import  DisplayCredentials from './DisplayCredentials';


describe('Test DisplayCredentials component', () => {
    console.log = jest.fn()
    test('DisiplayCredentials can render', () => {
        const testCredential = {
            credentialSubject: {
                data: {
                    givenName: 'testGivenName',
                    familyName: 'testGivenFamilyName',
                    hasIDDocument: {
                        hasIDDocument: {
                            documentType: "testType"
                        }
                    }
                },
            }
        }
        const { queryByText } = render(<DisplayCredentials cred={testCredential} />);

        expect(queryByText('Given Name:')).toBeTruthy();
        expect(queryByText(testCredential.credentialSubject.data.givenName)).toBeTruthy();
        expect(queryByText('Family Name:')).toBeTruthy();
        expect(queryByText(testCredential.credentialSubject.data.familyName)).toBeTruthy();
        expect(queryByText('Document Type:')).toBeTruthy();
        expect(queryByText(testCredential.credentialSubject.data.hasIDDocument.hasIDDocument.documentType)).toBeTruthy()
    })
})