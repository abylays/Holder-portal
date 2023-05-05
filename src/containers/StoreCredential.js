import React, { useEffect, useState } from "react";
import {getSharedCredential, alertWithBrowserConsole, deleteCredential, storeSignedVCs} from '../utils/apiService';
import queryString from "query-string";
import {Button,Input} from 'antd'
import './StoreCredential.css'
const { TextArea } = Input;

const StoreCredential = (props) => {
    const [state, setState] = useState({
        currentUnsignedVC: null,
        currentSignedVC: null,
        isCurrentVCVerified: false,
        storedVCs: [],
        isLoadingStoredVCs: true
    });
    const [inputVC, setinputVC] = useState('');

    useEffect(() => {
        const getSavedVCs = async () => {
            try {
                const arrayOfStoredVCs = await getSharedCredential();

                setState({
                    ...state,
                    storedVCs: [...arrayOfStoredVCs],
                    isLoadingStoredVCs: false
                })
            } catch (error) {
                setState({
                    ...state,
                    isLoadingStoredVCs: false
                });
                this.props.history.push('/login');
              return alertWithBrowserConsole(error.message)


            }
        };
        getSavedVCs();
    }, []);

    const onVCValueChange = (value) => {
        setinputVC(value)
    };

    const deleteStoredVC = async (index) => {
        try {
            await deleteCredential(state.storedVCs[index].id);

            setState({
                ...state,
                storedVCs: state.storedVCs.filter((value, idx) => idx !== index)
            })

            alert('Verified VC successfully deleted from your cloud wallet.');
        } catch (error) {
            return alertWithBrowserConsole(error.message);
        }
    };

    const isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    const storeSignedVC = async () => {
        try {
            if (isJson(inputVC)) {
                const vc = JSON.parse(inputVC);
                await storeSignedVCs({
                    data: [vc]
                });

                setState({
                    ...state,
                    storedVCs: [...state.storedVCs, vc]
                })

                alert('Signed VC successfully stored in your cloud wallet.');
                setinputVC('')
            }
            else {
                alert('No signed VC found. Please sign a VC and try again.');
            }
        } catch (error) {
            return alertWithBrowserConsole(error.message);
        }
    }
    return (
        <div className='tutorial'>
            {/* <div className='tutorial__column tutorial__column--holder'>
        <h3 className='tutorial__column-title'>Holder</h3>
        <div className='tutorial__column-steps'>
          <div className='tutorial__step'> */}
            <span className='tutorial__step-text'>
              {/* <strong>Step 3:</strong>  */}
                Store signed VC
            </span>
            {/* </div> */}

            {/* <h5 className='font-weight-bold'>Current VC:{(!state.currentUnsignedVC && !state.currentSignedVC) && (' None')}</h5> */}
            <TextArea
                rows={15}
                placeholder="Enter the VC"
                aria-label="Verifiable Credential"
                aria-describedby="basic-addon1"
                value={inputVC}
                onChange={e => onVCValueChange(e.target.value)}
                style={{margin: '20px 0'}}
            />
            <Button type="primary" onClick={storeSignedVC}>Store signed VC</Button>
            {(state.currentUnsignedVC || state.currentSignedVC) && (
                <>
                    <div>
                <span className='tutorial__status'>
                  <input
                      className='tutorial__status-input'
                      type='checkbox'
                      readOnly
                      checked={!!state.currentSignedVC}
                      id='vc-signed-checkbox'
                  />
                  <label htmlFor='vc-signed-checkbox'>Signed</label>
                </span>
                        <span className='tutorial__status'>
                  <input
                      className='tutorial__status-input'
                      type='checkbox'
                      readOnly
                      checked={state.isCurrentVCVerified}
                      id='vc-verified-checkbox'
                  />
                  <label htmlFor='vc-verified-checkbox'>Verified</label>
                </span>
                    </div>
                    <textarea
                        className='tutorial__textarea'
                        readOnly
                        name='credentials'
                        value={JSON.stringify(state.currentSignedVC || state.currentUnsignedVC, undefined, '\t')}
                    />
                </>
            )}

            <div className='tutorial__verified-vcs'>
                <h5 className='font-weight-bold'>Stored VCs:</h5>
                {state.isLoadingStoredVCs && <p>Loading...</p>}
                {!state.storedVCs.length && ('You didn\'t store any signed VCs')}
                {state.storedVCs.map((storedVC, index) => {
                    return (
                        <div key={index} className='tutorial__textarea-block'>
                  <textarea
                      className='tutorial__textarea tutorial__textarea--small'
                      readOnly
                      name='stored-credentials'
                      value={JSON.stringify(storedVC, undefined, '\t')}
                  />
                            <Button type="primary" className='tutorial__delete-button' onClick={() => deleteStoredVC(index)}>Delete

                                this VC</Button>
                            {/*<Button className='tutorial__delete-button' onClick={() => shareStoredVC(storedVC)}>Add this VC to VP</Button>*/}
                        </div>
                    )
                })}
            </div>
            {/* </div>
      </div> */}
        </div>
    )
}

export default StoreCredential
