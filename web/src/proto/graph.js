/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.visionflow = (function () {

    /**
     * Namespace visionflow.
     * @exports visionflow
     * @namespace
     */
    var visionflow = {};

    visionflow.Node = (function () {

        /**
         * Properties of a Node.
         * @memberof visionflow
         * @interface INode
         * @property {string|null} [id] Node id
         * @property {string|null} [label] Node label
         * @property {string|null} [type] Node type
         * @property {number|null} [x] Node x
         * @property {number|null} [y] Node y
         * @property {string|null} [diffState] Node diffState
         */

        /**
         * Constructs a new Node.
         * @memberof visionflow
         * @classdesc Represents a Node.
         * @implements INode
         * @constructor
         * @param {visionflow.INode=} [properties] Properties to set
         */
        function Node(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Node id.
         * @member {string} id
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.id = "";

        /**
         * Node label.
         * @member {string} label
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.label = "";

        /**
         * Node type.
         * @member {string} type
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.type = "";

        /**
         * Node x.
         * @member {number} x
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.x = 0;

        /**
         * Node y.
         * @member {number} y
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.y = 0;

        /**
         * Node diffState.
         * @member {string} diffState
         * @memberof visionflow.Node
         * @instance
         */
        Node.prototype.diffState = "";

        /**
         * Creates a new Node instance using the specified properties.
         * @function create
         * @memberof visionflow.Node
         * @static
         * @param {visionflow.INode=} [properties] Properties to set
         * @returns {visionflow.Node} Node instance
         */
        Node.create = function create(properties) {
            return new Node(properties);
        };

        /**
         * Encodes the specified Node message. Does not implicitly {@link visionflow.Node.verify|verify} messages.
         * @function encode
         * @memberof visionflow.Node
         * @static
         * @param {visionflow.INode} message Node message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Node.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.x != null && Object.hasOwnProperty.call(message, "x"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.x);
            if (message.y != null && Object.hasOwnProperty.call(message, "y"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.y);
            if (message.diffState != null && Object.hasOwnProperty.call(message, "diffState"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.diffState);
            return writer;
        };

        /**
         * Encodes the specified Node message, length delimited. Does not implicitly {@link visionflow.Node.verify|verify} messages.
         * @function encodeDelimited
         * @memberof visionflow.Node
         * @static
         * @param {visionflow.INode} message Node message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Node.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Node message from the specified reader or buffer.
         * @function decode
         * @memberof visionflow.Node
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {visionflow.Node} Node
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Node.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.visionflow.Node();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.id = reader.string();
                        break;
                    }
                    case 2: {
                        message.label = reader.string();
                        break;
                    }
                    case 3: {
                        message.type = reader.string();
                        break;
                    }
                    case 4: {
                        message.x = reader.float();
                        break;
                    }
                    case 5: {
                        message.y = reader.float();
                        break;
                    }
                    case 6: {
                        message.diffState = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a Node message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof visionflow.Node
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {visionflow.Node} Node
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Node.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Node message.
         * @function verify
         * @memberof visionflow.Node
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Node.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.x != null && message.hasOwnProperty("x"))
                if (typeof message.x !== "number")
                    return "x: number expected";
            if (message.y != null && message.hasOwnProperty("y"))
                if (typeof message.y !== "number")
                    return "y: number expected";
            if (message.diffState != null && message.hasOwnProperty("diffState"))
                if (!$util.isString(message.diffState))
                    return "diffState: string expected";
            return null;
        };

        /**
         * Creates a Node message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof visionflow.Node
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {visionflow.Node} Node
         */
        Node.fromObject = function fromObject(object) {
            if (object instanceof $root.visionflow.Node)
                return object;
            var message = new $root.visionflow.Node();
            if (object.id != null)
                message.id = String(object.id);
            if (object.label != null)
                message.label = String(object.label);
            if (object.type != null)
                message.type = String(object.type);
            if (object.x != null)
                message.x = Number(object.x);
            if (object.y != null)
                message.y = Number(object.y);
            if (object.diffState != null)
                message.diffState = String(object.diffState);
            return message;
        };

        /**
         * Creates a plain object from a Node message. Also converts values to other types if specified.
         * @function toObject
         * @memberof visionflow.Node
         * @static
         * @param {visionflow.Node} message Node
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Node.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.label = "";
                object.type = "";
                object.x = 0;
                object.y = 0;
                object.diffState = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.x != null && message.hasOwnProperty("x"))
                object.x = options.json && !isFinite(message.x) ? String(message.x) : message.x;
            if (message.y != null && message.hasOwnProperty("y"))
                object.y = options.json && !isFinite(message.y) ? String(message.y) : message.y;
            if (message.diffState != null && message.hasOwnProperty("diffState"))
                object.diffState = message.diffState;
            return object;
        };

        /**
         * Converts this Node to JSON.
         * @function toJSON
         * @memberof visionflow.Node
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Node.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Node
         * @function getTypeUrl
         * @memberof visionflow.Node
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Node.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/visionflow.Node";
        };

        return Node;
    })();

    visionflow.Edge = (function () {

        /**
         * Properties of an Edge.
         * @memberof visionflow
         * @interface IEdge
         * @property {string|null} [source] Edge source
         * @property {string|null} [target] Edge target
         * @property {string|null} [type] Edge type
         * @property {number|null} [weight] Edge weight
         * @property {string|null} [diffState] Edge diffState
         */

        /**
         * Constructs a new Edge.
         * @memberof visionflow
         * @classdesc Represents an Edge.
         * @implements IEdge
         * @constructor
         * @param {visionflow.IEdge=} [properties] Properties to set
         */
        function Edge(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Edge source.
         * @member {string} source
         * @memberof visionflow.Edge
         * @instance
         */
        Edge.prototype.source = "";

        /**
         * Edge target.
         * @member {string} target
         * @memberof visionflow.Edge
         * @instance
         */
        Edge.prototype.target = "";

        /**
         * Edge type.
         * @member {string} type
         * @memberof visionflow.Edge
         * @instance
         */
        Edge.prototype.type = "";

        /**
         * Edge weight.
         * @member {number} weight
         * @memberof visionflow.Edge
         * @instance
         */
        Edge.prototype.weight = 0;

        /**
         * Edge diffState.
         * @member {string} diffState
         * @memberof visionflow.Edge
         * @instance
         */
        Edge.prototype.diffState = "";

        /**
         * Creates a new Edge instance using the specified properties.
         * @function create
         * @memberof visionflow.Edge
         * @static
         * @param {visionflow.IEdge=} [properties] Properties to set
         * @returns {visionflow.Edge} Edge instance
         */
        Edge.create = function create(properties) {
            return new Edge(properties);
        };

        /**
         * Encodes the specified Edge message. Does not implicitly {@link visionflow.Edge.verify|verify} messages.
         * @function encode
         * @memberof visionflow.Edge
         * @static
         * @param {visionflow.IEdge} message Edge message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Edge.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.target != null && Object.hasOwnProperty.call(message, "target"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.target);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.type);
            if (message.weight != null && Object.hasOwnProperty.call(message, "weight"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.weight);
            if (message.diffState != null && Object.hasOwnProperty.call(message, "diffState"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.diffState);
            return writer;
        };

        /**
         * Encodes the specified Edge message, length delimited. Does not implicitly {@link visionflow.Edge.verify|verify} messages.
         * @function encodeDelimited
         * @memberof visionflow.Edge
         * @static
         * @param {visionflow.IEdge} message Edge message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Edge.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Edge message from the specified reader or buffer.
         * @function decode
         * @memberof visionflow.Edge
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {visionflow.Edge} Edge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Edge.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.visionflow.Edge();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        message.source = reader.string();
                        break;
                    }
                    case 2: {
                        message.target = reader.string();
                        break;
                    }
                    case 3: {
                        message.type = reader.string();
                        break;
                    }
                    case 4: {
                        message.weight = reader.float();
                        break;
                    }
                    case 5: {
                        message.diffState = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes an Edge message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof visionflow.Edge
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {visionflow.Edge} Edge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Edge.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Edge message.
         * @function verify
         * @memberof visionflow.Edge
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Edge.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.target != null && message.hasOwnProperty("target"))
                if (!$util.isString(message.target))
                    return "target: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.weight != null && message.hasOwnProperty("weight"))
                if (typeof message.weight !== "number")
                    return "weight: number expected";
            if (message.diffState != null && message.hasOwnProperty("diffState"))
                if (!$util.isString(message.diffState))
                    return "diffState: string expected";
            return null;
        };

        /**
         * Creates an Edge message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof visionflow.Edge
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {visionflow.Edge} Edge
         */
        Edge.fromObject = function fromObject(object) {
            if (object instanceof $root.visionflow.Edge)
                return object;
            var message = new $root.visionflow.Edge();
            if (object.source != null)
                message.source = String(object.source);
            if (object.target != null)
                message.target = String(object.target);
            if (object.type != null)
                message.type = String(object.type);
            if (object.weight != null)
                message.weight = Number(object.weight);
            if (object.diffState != null)
                message.diffState = String(object.diffState);
            return message;
        };

        /**
         * Creates a plain object from an Edge message. Also converts values to other types if specified.
         * @function toObject
         * @memberof visionflow.Edge
         * @static
         * @param {visionflow.Edge} message Edge
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Edge.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.target = "";
                object.type = "";
                object.weight = 0;
                object.diffState = "";
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.target != null && message.hasOwnProperty("target"))
                object.target = message.target;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.weight != null && message.hasOwnProperty("weight"))
                object.weight = options.json && !isFinite(message.weight) ? String(message.weight) : message.weight;
            if (message.diffState != null && message.hasOwnProperty("diffState"))
                object.diffState = message.diffState;
            return object;
        };

        /**
         * Converts this Edge to JSON.
         * @function toJSON
         * @memberof visionflow.Edge
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Edge.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Edge
         * @function getTypeUrl
         * @memberof visionflow.Edge
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Edge.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/visionflow.Edge";
        };

        return Edge;
    })();

    visionflow.GraphChunk = (function () {

        /**
         * Properties of a GraphChunk.
         * @memberof visionflow
         * @interface IGraphChunk
         * @property {Array.<visionflow.INode>|null} [nodes] GraphChunk nodes
         * @property {Array.<visionflow.IEdge>|null} [edges] GraphChunk edges
         */

        /**
         * Constructs a new GraphChunk.
         * @memberof visionflow
         * @classdesc Represents a GraphChunk.
         * @implements IGraphChunk
         * @constructor
         * @param {visionflow.IGraphChunk=} [properties] Properties to set
         */
        function GraphChunk(properties) {
            this.nodes = [];
            this.edges = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GraphChunk nodes.
         * @member {Array.<visionflow.INode>} nodes
         * @memberof visionflow.GraphChunk
         * @instance
         */
        GraphChunk.prototype.nodes = $util.emptyArray;

        /**
         * GraphChunk edges.
         * @member {Array.<visionflow.IEdge>} edges
         * @memberof visionflow.GraphChunk
         * @instance
         */
        GraphChunk.prototype.edges = $util.emptyArray;

        /**
         * Creates a new GraphChunk instance using the specified properties.
         * @function create
         * @memberof visionflow.GraphChunk
         * @static
         * @param {visionflow.IGraphChunk=} [properties] Properties to set
         * @returns {visionflow.GraphChunk} GraphChunk instance
         */
        GraphChunk.create = function create(properties) {
            return new GraphChunk(properties);
        };

        /**
         * Encodes the specified GraphChunk message. Does not implicitly {@link visionflow.GraphChunk.verify|verify} messages.
         * @function encode
         * @memberof visionflow.GraphChunk
         * @static
         * @param {visionflow.IGraphChunk} message GraphChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GraphChunk.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodes != null && message.nodes.length)
                for (var i = 0; i < message.nodes.length; ++i)
                    $root.visionflow.Node.encode(message.nodes[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.edges != null && message.edges.length)
                for (var i = 0; i < message.edges.length; ++i)
                    $root.visionflow.Edge.encode(message.edges[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GraphChunk message, length delimited. Does not implicitly {@link visionflow.GraphChunk.verify|verify} messages.
         * @function encodeDelimited
         * @memberof visionflow.GraphChunk
         * @static
         * @param {visionflow.IGraphChunk} message GraphChunk message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GraphChunk.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GraphChunk message from the specified reader or buffer.
         * @function decode
         * @memberof visionflow.GraphChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {visionflow.GraphChunk} GraphChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GraphChunk.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.visionflow.GraphChunk();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                    case 1: {
                        if (!(message.nodes && message.nodes.length))
                            message.nodes = [];
                        message.nodes.push($root.visionflow.Node.decode(reader, reader.uint32()));
                        break;
                    }
                    case 2: {
                        if (!(message.edges && message.edges.length))
                            message.edges = [];
                        message.edges.push($root.visionflow.Edge.decode(reader, reader.uint32()));
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GraphChunk message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof visionflow.GraphChunk
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {visionflow.GraphChunk} GraphChunk
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GraphChunk.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GraphChunk message.
         * @function verify
         * @memberof visionflow.GraphChunk
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GraphChunk.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodes != null && message.hasOwnProperty("nodes")) {
                if (!Array.isArray(message.nodes))
                    return "nodes: array expected";
                for (var i = 0; i < message.nodes.length; ++i) {
                    var error = $root.visionflow.Node.verify(message.nodes[i]);
                    if (error)
                        return "nodes." + error;
                }
            }
            if (message.edges != null && message.hasOwnProperty("edges")) {
                if (!Array.isArray(message.edges))
                    return "edges: array expected";
                for (var i = 0; i < message.edges.length; ++i) {
                    var error = $root.visionflow.Edge.verify(message.edges[i]);
                    if (error)
                        return "edges." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GraphChunk message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof visionflow.GraphChunk
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {visionflow.GraphChunk} GraphChunk
         */
        GraphChunk.fromObject = function fromObject(object) {
            if (object instanceof $root.visionflow.GraphChunk)
                return object;
            var message = new $root.visionflow.GraphChunk();
            if (object.nodes) {
                if (!Array.isArray(object.nodes))
                    throw TypeError(".visionflow.GraphChunk.nodes: array expected");
                message.nodes = [];
                for (var i = 0; i < object.nodes.length; ++i) {
                    if (typeof object.nodes[i] !== "object")
                        throw TypeError(".visionflow.GraphChunk.nodes: object expected");
                    message.nodes[i] = $root.visionflow.Node.fromObject(object.nodes[i]);
                }
            }
            if (object.edges) {
                if (!Array.isArray(object.edges))
                    throw TypeError(".visionflow.GraphChunk.edges: array expected");
                message.edges = [];
                for (var i = 0; i < object.edges.length; ++i) {
                    if (typeof object.edges[i] !== "object")
                        throw TypeError(".visionflow.GraphChunk.edges: object expected");
                    message.edges[i] = $root.visionflow.Edge.fromObject(object.edges[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GraphChunk message. Also converts values to other types if specified.
         * @function toObject
         * @memberof visionflow.GraphChunk
         * @static
         * @param {visionflow.GraphChunk} message GraphChunk
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GraphChunk.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.nodes = [];
                object.edges = [];
            }
            if (message.nodes && message.nodes.length) {
                object.nodes = [];
                for (var j = 0; j < message.nodes.length; ++j)
                    object.nodes[j] = $root.visionflow.Node.toObject(message.nodes[j], options);
            }
            if (message.edges && message.edges.length) {
                object.edges = [];
                for (var j = 0; j < message.edges.length; ++j)
                    object.edges[j] = $root.visionflow.Edge.toObject(message.edges[j], options);
            }
            return object;
        };

        /**
         * Converts this GraphChunk to JSON.
         * @function toJSON
         * @memberof visionflow.GraphChunk
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GraphChunk.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GraphChunk
         * @function getTypeUrl
         * @memberof visionflow.GraphChunk
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GraphChunk.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/visionflow.GraphChunk";
        };

        return GraphChunk;
    })();

    return visionflow;
})();

export { $root };
export const visionflow = $root.visionflow;
