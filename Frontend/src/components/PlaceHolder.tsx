import React from 'react'
import { Oval } from "react-loader-spinner"

const PlaceHolder = () => {
  return (
    <div data-testid="place-holder" className="mt-40">
      <Oval
        height={80}
        width={80}
        color="#0096FF"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#89CFF0"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

export default PlaceHolder