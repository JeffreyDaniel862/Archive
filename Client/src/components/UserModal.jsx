import { Modal } from "flowbite-react";
import UserCard from "./UserCard";

export default function UserModal({ showModal, closeModal, title, userArray }) {

    const handleKeyDown = (e) => {
        if(e.key === "Escape"){
            closeModal();
        }
    }

    return (
        <Modal onKeyDown={handleKeyDown} show={showModal} size={'md'} popup onClose={closeModal}>
            <Modal.Header>
                {title}
            </Modal.Header>
            <Modal.Body>
                {
                    userArray?.length > 0 ?
                        <div>
                            {
                                userArray?.map(follower => <UserCard key={follower.username} onClose={closeModal} user={follower} />)
                            }
                        </div>
                        :
                        <p>No Followers</p>
                }
            </Modal.Body>
        </Modal>
    )
}