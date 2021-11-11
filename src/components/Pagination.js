import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";

function HMS(seconds) {
  var date = new Date(null);
  date.setSeconds(seconds);
  return `${date.toISOString().substr(11, 8)} [Hours:Minutes:Seconds]`;
}

function Items({ callItems, isLoading }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [callItem, setCallItem] = useState({});
  const [callDuration, setCallDuration] = useState(0);

  function modalHandler(item) {
    setModalVisible(true);
    setCallItem(item);
    setCallDuration(HMS(item.duration));
  }

  if (isLoading) {
    return (
      <div className="center container">
        <Dots />
      </div>
    );
  } else
    return (
      <>
        {callItems.map((item) => {
          if (modalVisible) {
            return (
              <div key={item.id}>
                <Modal
                  isOpen={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                  style={modalStyles}
                  contentLabel="Call Details"
                >
                  <button
                    className="btn red"
                    onClick={() => setModalVisible(false)}
                  >
                    X
                  </button>
                  <div class="row">
                    <div class="col-sm-6 col-md-4 v my-2">
                      <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                          <span class="card-title">Call ID: {callItem.id}</span>
                          <p>Call Duration: {callDuration}</p>
                          <p>Call Type: {callItem.call_type}</p>
                        </div>
                        <div class="card-action">
                          <a>From: {callItem.from}</a>
                          <a>To: {callItem.to}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            );
          }
          return (
            <div onClick={() => modalHandler(item)}>
              <div key={item.id} className="col-sm-6 col-md-4 v my-2">
                <div
                  className="card shadow-sm w-100"
                  style={{ minHeight: 225 }}
                >
                  <div className="card-body">
                    <h5 className="card-title text-center h2">
                      Call Id: {item.id}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted text-center">
                      Call Duration: {HMS(item.duration)}
                    </h6>
                    <p className="card-text">Call Type: {item.call_type}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
}

function Pagination({ limit, callItems, totalPages }) {
  // We start with an empty list of items
  const pageCount = totalPages;
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [items, setItems] = useState(callItems);
  const [isLoading, setIsLoading] = useState(false);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    setIsLoading(true);
    const aT = JSON.parse(sessionStorage.getItem("access_token"));
    setItemOffset(itemOffset + limit);
    fetch(
      `https://frontend-test-api.aircall.io/calls?offset=${
        itemOffset + limit
      }&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${aT}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data.nodes);
        console.log(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Looks like you aren't connected to the internet!");
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <div className="row m-2">
          <Items callItems={items} isLoading={isLoading} />
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"blue"}
          />
        </div>
      </div>
    </>
  );
}

export default Pagination;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
