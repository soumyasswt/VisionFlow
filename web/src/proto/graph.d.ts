import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace visionflow. */
export namespace visionflow {

    /** Properties of a Node. */
    interface INode {

        /** Node id */
        id?: (string|null);

        /** Node label */
        label?: (string|null);

        /** Node type */
        type?: (string|null);

        /** Node x */
        x?: (number|null);

        /** Node y */
        y?: (number|null);

        /** Node diffState */
        diffState?: (string|null);
    }

    /** Represents a Node. */
    class Node implements INode {

        /**
         * Constructs a new Node.
         * @param [properties] Properties to set
         */
        constructor(properties?: visionflow.INode);

        /** Node id. */
        public id: string;

        /** Node label. */
        public label: string;

        /** Node type. */
        public type: string;

        /** Node x. */
        public x: number;

        /** Node y. */
        public y: number;

        /** Node diffState. */
        public diffState: string;

        /**
         * Creates a new Node instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Node instance
         */
        public static create(properties?: visionflow.INode): visionflow.Node;

        /**
         * Encodes the specified Node message. Does not implicitly {@link visionflow.Node.verify|verify} messages.
         * @param message Node message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: visionflow.INode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Node message, length delimited. Does not implicitly {@link visionflow.Node.verify|verify} messages.
         * @param message Node message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: visionflow.INode, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Node message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Node
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): visionflow.Node;

        /**
         * Decodes a Node message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Node
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): visionflow.Node;

        /**
         * Verifies a Node message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Node message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Node
         */
        public static fromObject(object: { [k: string]: any }): visionflow.Node;

        /**
         * Creates a plain object from a Node message. Also converts values to other types if specified.
         * @param message Node
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: visionflow.Node, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Node to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Node
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an Edge. */
    interface IEdge {

        /** Edge source */
        source?: (string|null);

        /** Edge target */
        target?: (string|null);

        /** Edge type */
        type?: (string|null);

        /** Edge weight */
        weight?: (number|null);

        /** Edge diffState */
        diffState?: (string|null);
    }

    /** Represents an Edge. */
    class Edge implements IEdge {

        /**
         * Constructs a new Edge.
         * @param [properties] Properties to set
         */
        constructor(properties?: visionflow.IEdge);

        /** Edge source. */
        public source: string;

        /** Edge target. */
        public target: string;

        /** Edge type. */
        public type: string;

        /** Edge weight. */
        public weight: number;

        /** Edge diffState. */
        public diffState: string;

        /**
         * Creates a new Edge instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Edge instance
         */
        public static create(properties?: visionflow.IEdge): visionflow.Edge;

        /**
         * Encodes the specified Edge message. Does not implicitly {@link visionflow.Edge.verify|verify} messages.
         * @param message Edge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: visionflow.IEdge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Edge message, length delimited. Does not implicitly {@link visionflow.Edge.verify|verify} messages.
         * @param message Edge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: visionflow.IEdge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Edge message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Edge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): visionflow.Edge;

        /**
         * Decodes an Edge message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Edge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): visionflow.Edge;

        /**
         * Verifies an Edge message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Edge message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Edge
         */
        public static fromObject(object: { [k: string]: any }): visionflow.Edge;

        /**
         * Creates a plain object from an Edge message. Also converts values to other types if specified.
         * @param message Edge
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: visionflow.Edge, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Edge to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Edge
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GraphChunk. */
    interface IGraphChunk {

        /** GraphChunk nodes */
        nodes?: (visionflow.INode[]|null);

        /** GraphChunk edges */
        edges?: (visionflow.IEdge[]|null);
    }

    /** Represents a GraphChunk. */
    class GraphChunk implements IGraphChunk {

        /**
         * Constructs a new GraphChunk.
         * @param [properties] Properties to set
         */
        constructor(properties?: visionflow.IGraphChunk);

        /** GraphChunk nodes. */
        public nodes: visionflow.INode[];

        /** GraphChunk edges. */
        public edges: visionflow.IEdge[];

        /**
         * Creates a new GraphChunk instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GraphChunk instance
         */
        public static create(properties?: visionflow.IGraphChunk): visionflow.GraphChunk;

        /**
         * Encodes the specified GraphChunk message. Does not implicitly {@link visionflow.GraphChunk.verify|verify} messages.
         * @param message GraphChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: visionflow.IGraphChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GraphChunk message, length delimited. Does not implicitly {@link visionflow.GraphChunk.verify|verify} messages.
         * @param message GraphChunk message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: visionflow.IGraphChunk, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GraphChunk message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GraphChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): visionflow.GraphChunk;

        /**
         * Decodes a GraphChunk message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GraphChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): visionflow.GraphChunk;

        /**
         * Verifies a GraphChunk message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GraphChunk message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GraphChunk
         */
        public static fromObject(object: { [k: string]: any }): visionflow.GraphChunk;

        /**
         * Creates a plain object from a GraphChunk message. Also converts values to other types if specified.
         * @param message GraphChunk
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: visionflow.GraphChunk, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GraphChunk to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GraphChunk
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
