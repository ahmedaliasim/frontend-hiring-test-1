import React, { useState } from "react";
import Modal from "react-modal";

function CallModal(modalState, callItem) {
  const [modalVisible, setModalVisible] = useState(modalState);

  return (
    <div>
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={modalStyles}
        contentLabel="Call Details"
      >
        <button onClick={closeModal}>Close</button>
        <div class="row">
          <div class="col s12 m6">
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title">Call ID: {callItem.id}</span>
                <p>Call Duration: {props.duration}</p>
                <p>Call zzzz: {props.duration}</p>
              </div>
              <div class="card-action">
                <a href="#">This is a link</a>
                <a href="#">This is a link</a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CallModal;
