import React from 'react';

const ListTile = ({data, key}) => {
  return (
    <div key={key} className="col-12 bg-white shadow p-3 mb-4 rounded-3">
      <p className="m-0">{data}</p>
    </div>
  )
}

export default ListTile