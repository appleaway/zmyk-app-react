import React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';

function Update(props: RouteComponentProps) {

  console.log("update props", props)

  return <div>
    <h1>Update</h1>
    <Link to="/home">to Home Page</Link>
  </div>
}

export default Update;