import { useState } from "react";
type ModalType = "success" | "error" | "info";
interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
}

export const useModal = () => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        title: "",
        message: "",
        type: "success",
    });

    const showModal = (title: string, message: string, type: ModalType = "success") => {
        setModalState({
            isOpen: true,
            title,
            message,
            type,
        });
    };

    const closeModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    return {
        modalState,
        showModal,
        closeModal,
    };
};