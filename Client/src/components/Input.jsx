import { Label, TextInput } from "flowbite-react";

export default function Input({ holder, id }) {
    return <div>
        <Label value={holder} />
        <TextInput type="text" placeholder={holder} id={id} />
    </div>
}