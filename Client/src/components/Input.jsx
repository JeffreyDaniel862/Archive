import { Label, TextInput } from "flowbite-react";

export default function Input({ holder, id, type, ...props }) {
    return <div>
        <Label value={holder} />
        <TextInput type={type} placeholder={holder} id={id} {...props} />
    </div>
}