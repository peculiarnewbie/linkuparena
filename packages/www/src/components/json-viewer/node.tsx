import { createSignal, Show, For, createMemo } from "solid-js";

interface JsonNodeProps {
    value: any;
    nodeKey?: string | number; // Key if part of an object, index if part of an array
    filter: string; // The current filter term (lowercase)
    path: string; // A unique path string for this node (e.g., "root.users.0.name")
    level?: number; // Indentation level
}

// Helper to check if any descendant matches the filter recursively
const hasMatchingDescendant = (
    value: any,
    filter: string,
    isRoot = true,
): boolean => {
    // Performance: If filter is empty, everything matches visibility-wise
    if (filter === "") return true;

    // Base case: primitive values
    if (typeof value !== "object" || value === null) {
        // Don't match the root primitive value itself in this helper
        return !isRoot && String(value).toLowerCase().includes(filter);
    }

    // Recursive case: arrays
    if (Array.isArray(value)) {
        return value.some((item, index) => {
            // Check if index matches
            if (String(index).toLowerCase().includes(filter)) return true;
            // Check if item or its descendants match
            return hasMatchingDescendant(item, filter, false);
        });
    }

    // Recursive case: objects
    return Object.entries(value).some(([key, val]) => {
        // Check if key matches
        if (key.toLowerCase().includes(filter)) return true;
        // Check if value or its descendants match
        return hasMatchingDescendant(val, filter, false);
    });
};

const JsonNode = (props: JsonNodeProps) => {
    const level = props.level ?? 0;
    const [isExpanded, setIsExpanded] = createSignal(level < 2);

    const nodeType = createMemo(() => {
        if (props.value === null) return "null";
        if (Array.isArray(props.value)) return "array";
        return typeof props.value;
    });

    const isExpandable = createMemo(
        () => nodeType() === "object" || nodeType() === "array",
    );
    const isEmpty = createMemo(() =>
        isExpandable()
            ? nodeType() === "array"
                ? props.value.length === 0
                : Object.keys(props.value).length === 0
            : false,
    );

    const toggleExpansion = () => {
        if (isExpandable() && !isEmpty()) {
            setIsExpanded(!isExpanded());
        }
    };

    // Check if the current node's key or primitive value matches the filter
    const selfMatches = createMemo(() => {
        const filter = props.filter;
        if (filter === "") return true; // No filter means always match

        // Check key/index match
        if (
            props.nodeKey !== undefined &&
            String(props.nodeKey).toLowerCase().includes(filter)
        ) {
            return true;
        }

        // Check primitive value match (only if not expandable)
        if (!isExpandable() && props.value !== null) {
            return String(props.value).toLowerCase().includes(filter);
        }

        return false;
    });

    // Check if any descendant node matches the filter
    const descendantMatches = createMemo(() => {
        if (!isExpandable()) return false; // Primitives have no descendants here
        return hasMatchingDescendant(props.value, props.filter);
    });

    // Determine if this node should be rendered
    const isVisible = createMemo(() => {
        if (props.filter === "") return true; // Always show if no filter
        // Show if the node itself matches OR if any descendant matches
        return selfMatches() || descendantMatches();
    });

    // Get entries for iteration (objects or arrays)
    const entries = createMemo(() => {
        if (nodeType() === "object") return Object.entries(props.value);
        // Treat array as [index, value] pairs for consistency
        if (nodeType() === "array")
            return props.value.map((v: any, i: number) => [i, v]);
        return [];
    });

    // Renders the display value (e.g., "string", 123, {...}, [...])
    const renderDisplayValue = () => {
        switch (nodeType()) {
            case "string":
                return (
                    <span style={{ color: "#50a14f" }}>"{props.value}"</span>
                ); // Green
            case "number":
                return <span style={{ color: "#d19a66" }}>{props.value}</span>; // Orange
            case "boolean":
                return (
                    <span style={{ color: "#61afef" }}>
                        {String(props.value)}
                    </span>
                ); // Blue
            case "null":
                return <span style={{ color: "#c678dd" }}>null</span>; // Magenta
            case "object":
                const objLength = Object.keys(props.value).length;
                return (
                    <span>
                        {"{"}
                        <Show when={!isExpanded() && !isEmpty()}>
                            <span
                                style={{ color: "#999", "margin-left": "5px" }}
                            >
                                ...{objLength} item{objLength !== 1 ? "s" : ""}
                            </span>
                            {"}"}
                        </Show>
                    </span>
                );
            case "array":
                const arrLength = props.value.length;
                return (
                    <span>
                        {"["}
                        <Show when={!isExpanded() && !isEmpty()}>
                            <span
                                style={{ color: "#999", "margin-left": "5px" }}
                            >
                                ...{arrLength} item{arrLength !== 1 ? "s" : ""}
                            </span>
                            {"]"}
                        </Show>
                    </span>
                );
            default:
                return <span>{String(props.value)}</span>;
        }
    };

    return (
        <Show when={isVisible()}>
            <div
                style={{
                    "padding-left": `${level > 0 ? 20 : 0}px`,
                    "font-family": "monospace",
                    "line-height": "1.5",
                }}
            >
                {/* Clickable area for expanding/collapsing */}
                <span
                    onClick={toggleExpansion}
                    style={{
                        cursor:
                            isExpandable() && !isEmpty()
                                ? "pointer"
                                : "default",
                        display: "inline-flex",
                        "align-items": "center",
                    }}
                >
                    {/* Arrow indicator */}
                    <span
                        style={{
                            display: "inline-block",
                            width: "1em", // Reserve space even if no arrow
                            "text-align": "center",
                        }}
                    >
                        <Show when={isExpandable() && !isEmpty()}>
                            {isExpanded() ? "▼" : "▶"}
                        </Show>
                    </span>

                    {/* Key/Index (if applicable) */}
                    <Show when={props.nodeKey !== undefined}>
                        <span style={{ color: "#a626a4" }}>
                            "{props.nodeKey}":{" "}
                        </span>
                    </Show>

                    {/* Value display */}
                    {renderDisplayValue()}
                </span>

                {/* Recursive rendering of children */}
                <Show when={isExpandable() && isExpanded() && !isEmpty()}>
                    <For each={entries()}>
                        {([key, val]) => (
                            // Each child node determines its own visibility based on the filter
                            <JsonNode
                                value={val}
                                nodeKey={key}
                                filter={props.filter}
                                path={`${props.path}.${key}`}
                                level={level + 1}
                            />
                        )}
                    </For>
                    {/* Closing bracket/brace */}
                    <div style={{ "padding-left": `${level > 0 ? 20 : 0}px` }}>
                        {nodeType() === "object" ? "}" : "]"}
                    </div>
                </Show>
            </div>
        </Show>
    );
};

export default JsonNode;
