import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";

export default function Home() {
  const [callItems, setCallItems] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const aT = JSON.parse(sessionStorage.getItem("access_token"));
    fetch(
      `https://frontend-test-api.aircall.io/calls?offset=0&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${aT}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setpageCount(Math.ceil(data.totalCount / limit));
        setCallItems(data.nodes);
      })
      .catch((error) => {
        console.log(error);
        alert("Your session has expired!");
        sessionStorage.removeItem("access_token");
        navigate("/");
      });
  }, []);

  // setInterval(() => {
  //   fetch("https://frontend-test-api.aircall.io/auth/refresh-token", {
  //     method: "POST",
  //     headers: { Authorization: `Bearer ${access_token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       sessionStorage.setItem(
  //         "access_token",
  //         JSON.stringify(data.access_token)
  //       );
  //       setAccess_token(data.access_token);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert("Looks like you aren't connected to the internet!");
  //     });
  // }, 59980);

  if (callItems.length === 0) {
    return (
      <div className="center container">
        <Dots />
      </div>
    );
  } else {
    return (
      <Pagination
        callItems={callItems}
        totalPages={pageCount}
        limit={limit}
      ></Pagination>
    );
  }
}
