import './alert.sass'
import {useState} from "react";
import {Alert, Button} from "react-bootstrap";


export class Popup {
    setShow: React.Dispatch<React.SetStateAction<boolean>>
    setMessage: React.Dispatch<React.SetStateAction<string>>
    element: () => JSX.Element

    constructor(setShow: React.Dispatch<React.SetStateAction<boolean>>,
                setMessage: React.Dispatch<React.SetStateAction<string>>,
                element: () => JSX.Element) {
        this.setShow = setShow;
        this.setMessage = setMessage;
        this.element = element;
    }
}

export function PopupElement(variant: string, heading?: string, onClose?: () => void): Popup {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const onCloseInner = () => {
        setShow(false);
        if (onClose !== undefined) {
            onClose();
        }
    };
    const Heading = variant === "danger" ? (
        <Alert.Heading>{heading === undefined ? 'Oh snap! You got an error!' : heading}</Alert.Heading>
    ) : variant === "success" ? (
        <Alert.Heading>{heading === undefined ? 'Success' : heading}</Alert.Heading>
    ) : <></>;
    return new Popup(
        setShow,
        setMessage,
        () => {
            if (show) {
                return (
                    <div className="goodguy-alert">
                        <Alert variant={variant} onClose={onCloseInner} dismissible>
                            {Heading}
                            <p>
                                {message}
                            </p>
                            <div className="d-flex justify-content-end">
                                <Button onClick={onCloseInner} variant={"outline-" + variant}>
                                    Close
                                </Button>
                            </div>
                        </Alert>
                    </div>
                );
            }
            return <></>;
        }
    );
}