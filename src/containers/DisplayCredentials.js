import React from 'react';

const DisplayCredentials = ({ cred }) =>
{
  const { data} = cred.credentialSubject.data;
  const { documentType } = cred.type[1];

  return (
    <>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Document Type:</strong> {documentType}</p>
    </>
  )
}

export default DisplayCredentials;
