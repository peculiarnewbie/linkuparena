import { createSignal, createMemo } from "solid-js";
import JsonNode from "./node";

interface JsonViewerProps {
    // The JSON data to display
    data: any;
    // Optional initial filter text
    initialFilter?: string;
}

const JsonViewer = (props: JsonViewerProps) => {
    const [filterInput, setFilterInput] = createSignal(
        props.initialFilter || "",
    );

    // Debounce filter input slightly? Maybe not necessary for this.
    // Convert filter to lowercase for case-insensitive matching
    const filter = createMemo(() => filterInput().toLowerCase());

    const handleInput = (event: Event) => {
        setFilterInput((event.target as HTMLInputElement).value);
    };

    return (
        <div style={{ padding: "10px", border: "1px solid #ccc" }}>
            <input
                type="text"
                placeholder="Filter by key or value..."
                value={filterInput()}
                onInput={handleInput}
                style={{
                    "margin-bottom": "15px",
                    padding: "8px 10px",
                    width: "calc(100% - 22px)", // Account for padding/border
                    border: "1px solid #ccc",
                    "border-radius": "4px",
                    "font-size": "14px",
                }}
            />
            <JsonNode
                value={props.data}
                filter={filter()}
                path="root"
                level={0}
            />
        </div>
    );
};

export default JsonViewer;
