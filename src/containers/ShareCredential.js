import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Button } from "antd";
import { useAsync, useAsyncFn } from "react-use";
import queryString from 'query-string'
import {getRequestedCredentials,getDID,createSharedResponseToken} from "../utils/apiService";
import './ShareCredential.css';
import ShareVC from "./ShareVC";
import jwt_decode from "jwt-decode";

import 'antd/dist/antd.css';
import { Checkbox } from 'antd';

function parseInfoFromToken(token)
{
  try {
    const  payload  = jwt_decode(token)
    const callbackURL = (payload.interactionToken || {}).callbackURL || undefined
    const requesterDid = payload.iss
    return { requesterDid, callbackURL }
  } catch (err) {
    console.log(err)
    return {}
  }
}

async function getCredentials(credentialShareRequestToken)
{
    //const credentials = await window.sdk.getCredentials(credentialShareRequestToken)
    const credentials = await getRequestedCredentials(credentialShareRequestToken)

    if (!Array.isArray(credentials) || credentials.length < 1) {
    const error = new Error('No credential found for this request!')
    throw error
  }
  return credentials
}

async function createCredentialShareResponseToken(credentialShareRequestToken, credentials, requesterDid, history)
{
  const credentialShareResponseToken = await createSharedResponseToken(credentialShareRequestToken, credentials)
  if (requesterDid && credentialShareResponseToken) {
   // const mes = await window.messageService.send(requesterDid, { token: credentialShareResponseToken })
    alert('Credential shared successfully!')
    history.push('/')
  }
  return { credentialShareResponseToken }
}



const ShareCredential =  (props) =>
{
  const credentialShareRequestToken = queryString.parse(props.location.search).token ||'';
  const { requesterDid } = parseInfoFromToken(credentialShareRequestToken);
    const [selected, setSelected] = useState('')
    const [selectedVP,setSelectedVP]=useState([]);
    const [shareToken,setshareToken]=useState([]);
    const [isResult, setResult]=useState(false)
    //const [credentials, setcredentials] = useState([])

    const { loading: credentialsLoading, value: credentials, error: credentialsError } = useAsync(
        () =>  getCredentials(credentialShareRequestToken),
        [credentialShareRequestToken]
    )


    const [
        { loading: createVPLoading, value: presentation, error: createVPError },
        onCreateVP
    ] = useAsyncFn(
        (credentials) => createCredentialShareResponseToken(credentialShareRequestToken, credentials, requesterDid, props.history),
        [credentialShareRequestToken, credentials, requesterDid]
    );

    useEffect(() => {
      console.log("this is seleceted Vp",selectedVP)
    },[selectedVP]);

    const onChange=(e,credential)=> {
        setResult(false)
        let data = [...selectedVP];
        if (e.target.checked === true) {
          console.log("this is check true called")
            data.push(credential);
            setSelectedVP(data)
        } else {
            console.log("this is check  false")
            data = data.filter((item) => {
              console.log("item",item.id,credential.id)
              return item.id !== credential.id
            });
            console.log("remove data",data);
            setSelectedVP(data)
        }
    }

const handleVPSubmit=async()=>{
    const credentialShareRequestToken = queryString.parse(props.location.search).token ||'';
    const response = await createSharedResponseToken(credentialShareRequestToken, selectedVP);
    setshareToken(response);
    alert("Token created successfully. You can now copy the token")
    setResult(true)
}

  const searchKeyDetail = (credential) =>
  {
    const types = credential.type
    if (types[types.length - 1] === 'NameCredentialPersonV1') {
      return 'Name Document'
    }
    if (types[types.length - 1] === 'IDDocumentCredentialPersonV1') {
      if (credential.credentialSubject.data.hasIDDocument.hasIDDocument.documentType === 'driving_license') {
        return 'Driving License'
      }
    }
    return credential.type[1]
  }

  useEffect(() =>
  {
    const checkLogin = async () =>
    {

      try {
        const  did  = await getDID();
        if (did) {
          props.userHasAuthenticated(true)
        }
      } catch (error) {
        if (queryString.parse(props.location.search).token) {
          props.setShareRequestToken(queryString.parse(props.location.search).token);
        }
        alert('Please login.')
        props.history.push('/login')
      }
    }
    try {
      checkLogin()
    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='ShareCred'>
      <div className='Form container'>
        <h1 className='Title'>Share Credentials</h1>
        <p>Please select which Credential you would like to share</p>
        <Table striped bordered hover size='sm'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Select</th>
              <th>Select VP</th>
            </tr>
          </thead>
          <tbody>
            {(credentials || []).map((credential, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{credential.credentialSubject.data.name}</td>
                <td>{searchKeyDetail(credential)}</td>
                <td>
                  <Button onClick={() => setSelected(credential)}>Share</Button>
                </td>
                <td>
                    <Checkbox onChange={(e)=>onChange(e,credential)}>Add</Checkbox>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {selected &&
          <ShareVC selectedCard={selected} onClose={() => setSelected('')} setCred={(cred) => { onCreateVP([cred]) }} />
        }
      </div>
        <Button type="primary" onClick={handleVPSubmit}>Submit Credentials</Button>
        <Button type="primary" style={{margin:"5px"}}
            onClick={() =>  navigator.clipboard.writeText(shareToken)}
        >
            Copy
        </Button>
    </div>
  )
}

export default ShareCredential;
