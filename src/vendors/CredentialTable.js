import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap'
import { unset } from 'lodash-es'

const CredentialTable = ({ credentials }) =>
{
  console.log("These are all the credentials",credentials[0].credential)
  const [vcData, setVCData] = useState([]);

  useEffect(() =>
  {
    const removeProp = (obj, propToDelete) =>
    {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (property === propToDelete) {
            unset(obj, property)
          } else if (typeof Object.prototype.hasOwnProperty.call(obj, property) == 'object') {
            removeProp(Object.prototype.hasOwnProperty.call(obj, property), propToDelete);
          }
        }
      }
      return obj
    }

    const initialiseVCData = (vcData) =>
    {
      let processedVCData = [];
      for (let vc in vcData) {
        processedVCData[parseInt(vc)] = vcData[parseInt(vc)].credential
        //processedVCData[parseInt(vc)] = removeProp(processedVCData[parseInt(vc)], '@type')
      }
      return processedVCData
    }

    setVCData(initialiseVCData(credentials))
  }, [credentials])

  const extractTypeFromVC = (cred) =>
  {

    if (cred.type) {
      return JSON.parse(cred.type[1])
    } else {
      return null
    }
  }

  return <div>
    <Table bordered>
      <thead className="thead-light">
        <tr>
          <th>Index</th>
            <th>Name</th>
          <th>VC Type</th>
        </tr>
      </thead>
      <tbody>
        {
          vcData.map((cred, index) =>
          {
            return (
              <tr key={index + 1}>
                <th scope='row'>{index + 1}</th>
                <td>{cred.credentialSubject.data.name}</td>
                <td>{cred.type[1]}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  </div>
}

export default CredentialTable;
