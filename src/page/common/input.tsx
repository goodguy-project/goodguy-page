import './input.sass'
import {ChangeEvent} from "react";
import {Form, FormControl, InputGroup} from "react-bootstrap";

type InputGroupProps = {
    text?: string;
    setValue?: (_: string) => void;
    placeholder?: string;
    type?: string;
    value?: string | number;
    required?: boolean;
    onKeyPress?: (event: any) => void;
};

export function GetInputGroup(props: InputGroupProps) {
    const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (props.setValue !== undefined) {
            props.setValue(event.target.value);
        }
    };
    return (
        <div className="goodguy-input-group">
            <InputGroup className="m-2">
                {
                    props.text !== undefined ? (
                        <InputGroup.Text id="basic-addon1">
                            {props.text}{props.required ? " *" : ""}
                        </InputGroup.Text>
                    ): <></>
                }
                <FormControl
                    placeholder={props.placeholder}
                    aria-label=""
                    type={props.type ? props.type : "text"}
                    aria-describedby="basic-addon1"
                    className="goodguy-input"
                    onChange={onChange}
                    defaultValue={props.value}
                    onKeyUp={props.onKeyPress}
                />
            </InputGroup>
        </div>
    );
}

export function GetSelect(setValue: (_: string) => void, text: string, items?: string[]) {
    if (items === undefined) {
        items = [''];
    }
    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value);
    };
    return (
        <div className="goodguy-input-group">
            <InputGroup className="m-2">
                <InputGroup.Text id="basic-addon1">{text}</InputGroup.Text>
                <Form.Select onChange={onChange}>
                    {
                        items.map((item, index) => {
                            return <option value={item} key={index}>{item}</option>
                        })
                    }
                </Form.Select>
            </InputGroup>
        </div>
    );
}
