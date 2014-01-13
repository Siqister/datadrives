// operator list
define([
    'd3',
    'underscoreM',
    'marionette',
    'templates',
    //'app/views/dataPreview',
    //'app/views/progressBar',
    'vent',
    'config',
    'workflowHash',

    'hammer',
    'hammer-jquery'
], function (
    d3,
    _,
    Marionette,
    templates,
    //DataPreviewView,
    //ProgressBarView,
    vent,
    config,
    workflowHash,

    Hammer
) {

    var OperatorFlow = {};

    var colorScale = d3.interpolateRgb(d3.rgb(255,204,0), d3.rgb(109,222,202));
    var i = 0;

    // private module level var

    var OperatorFlowView = Marionette.ItemView.extend({
        id: 'workflow-inner',
        template: _.template(templates.operatorFlow),
        initialize: function () {
            var self = this;
            _.bindAll(this,"toggleChildren");

            vent.on("operator:error", function (errorType) {
                self.showMessage("something went wrong");
            });

            vent.on("remove:node", function (data) {
                self.initRemove(data);
                console.log(data)
            });
        },
        onDomRefresh: function() {
            this.initGraph();
            this.renderFullGraph();

            //enable touch
            this.$el.hammer();
        },

        //does not apply to all d3 events
        events: {
            'click #execute': 'runFlow',
            'click #response': 'fetchData',
            'click #datasets': 'showSystemDatasets',
            'click #flow-canvas': 'canvasEvents',
            'resize': 'graph'
            //'click [class~=add-dataset]': 'showSystemDatasets',
        },

        collectionEvents: {
            'reset': 'renderFullGraph',
            'add': 'addNode',
            'remove': 'removeNode',
            'all': 'workflowModify',
            'sync': 'workflowSync'
        },

        //FIXME: workflowModify needs to be used because
        // deletion doesnt fire a proper sync due to the OPTIONS call
        workflowModify: function(t) {
			vent.trigger('workflow:modify');
            console.log(t)
        },
        workflowSync: function(t){
            vent.trigger('workflow:sync');
        },

        // append our itemViews here...
        ui: {
            list: '.operator-flow', //TODO: where is this?
            status: '#status',
            flowCanvas: '#flow-canvas',
            operatorActions: '#operator-actions'
        },

        initGraph: function () {
            var self = this;

            this.height= this.$el.height();
            this.width = this.$el.width();

            this.margin = {
                top: 20,
                left: 20,
                right: 20,
                bottom:20
            }

            this.linkDistance = 50;

            $(window).on('resize', function(){
                self.width = self.$el.width();
                self.height = self.$el.height();
                self.graph();
            })

            this.vis = d3.select("#flow-canvas").append("svg")
                    .attr("class", "viz");

            //TODO: finesse this
            this.force = d3.layout.force()
                    .charge(-60)
                    .linkDistance(function(d){
                        if (d.target.highlighted){
                            return self.linkDistance * 2;
                        }else if(d.target.class === "parameter"){
                            return self.linkDistance/1.5;
                        }else{
                            return self.linkDistance;
                        }
                    })
                    .linkStrength(1)
                    .friction(.5)
                    .gravity(0);

            this.tree = d3.layout.tree();

            this.root = workflowHash;

            //running layout initially will give this.root
            //"depth" property
            this.nodes = this.tree.nodes(this.root); //assigns "depth"
            this.nodes = this.flattenNodes(this.root); //assigns "id"
            this.nodes.forEach(function(d){
                d.x = self.width/2;
                d.y = self.height/2;
            });
            this.links = [];

            //hiding all the children except for original datasets
            var originalDatasets = _.where(this.nodes, { depth: 1});
            originalDatasets.forEach(function(d){
                d.fixed = true;
            });

        },

        flattenNodes: function(root){
            var nodes = [];

            function recurseNode(node){
                if(node.children) node.children.forEach(function(v){ recurseNode(v); });
                if(!node.id){
                    //assigns unique id to each node in the tree
                    i += 1;
                    node.id = i;
                }
                nodes.push(node);
            }

            recurseNode(root);
            return nodes;
        },

        tracePath: function(child){
            //remove all previous highlights
            this.nodes.forEach(function(d){
                d.highlighted = false;
                d.isOption = false;
            });

            function recurseNode(node){
                if(node.parent) recurseNode(node.parent);
                node.highlighted = true;
            }

            recurseNode(child);
        },

        graph: function () {

            var self = this;

            //Adjusting for "resize" event
            this.vis.attr("width", this.width)
                    .attr("height", this.height);

            this.force
                .size([this.width, this.height])
                .on("tick", tick);

            //fix the position of the root node
            this.root.fixed = true;
            this.root.x = this.width/2;
            this.root.y = this.height/2;



            //NODE MANIPULATION

            //don't show terminal "workflow" nodes
            this.nodes.forEach(function(d){
                if(d.class == "workflow"){
                    var parent = d.parent;
                    parent._children = parent._children || [];
                    parent._children.push(d);
                    parent.children = _.reject(parent.children, function(dd){ return dd.id === d.id; });
                }
            });

            //layout function needs to be called repeatedly
            //as the "children" property of each node is updated/removed/added
            this.nodes = self.flattenNodes(this.root);

            //find terminal nodes in this iteration
            //each terminal node can either have "operator", "parameter" or "workflow" as children
            //TODO:fix this
            /*var terminalNodes = _.filter(this.nodes, function(d){
                //delete d.terminal;
                return d.terminal == true;
            });
            terminalNodes.forEach(function(d, j){
                console.log("---" + j)
                console.log("Terminal node: " + d.name);
                var _children = d._children || [];
                d.children = d.children? d.children : [];
                _children.forEach(function(dd){
                   if(dd.class == "operator" || dd.class == "parameter"){
                        dd.isOption = true;
                        self.toggleChildren(dd);

                        d.children.push(dd);

                       console.log(d.name + " " + dd.name + " " + d._children.indexOf(dd));

                       d._children.splice( d._children.indexOf(dd) ,1);
                        self.nodes.push(dd);
                   }
                });

                console.log(d.children);
                console.log(_children);

            });*/

            //Finally, generate links based on nodes
            this.links = self.tree.links(this.nodes);
            console.log("---Graph---");
            console.log(this.root);
            console.log(this.nodes);
            console.log(this.links);
            console.log("-------");


            //restart the force layout
            this.force
                .nodes(this.nodes)
                .links(this.links)
                .start();


            //draw, update or remove nodes
            var node = this.vis.selectAll("g.node")
                .data(this.nodes, function(d){ return d.id; });

            var nodeEnter = node.enter()
                .append("g")
                .attr("class", function(d){
                    return "node " + d.class;
                })
                .attr("transform", function(d){
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .on("click", function(d){
                    self.tracePath(d);
                    self.findWorkflow(d);
                    self.graph();
                })
                .call(this.force.drag);
            nodeEnter
                .append("svg:circle")
                .attr("r", function(d){
                    if(d.depth == 1) return 25;
                    //different sizes for "datasets", "operators", "parameters"
                    switch(d.class){
                        case "dataset":
                            return 10;
                            break;
                        case "operator":
                            return 17;
                            break;
                        case "parameter":
                            return 9;
                            break;
                        default:
                            return 20;
                    }
                })
                .style("fill", function(d){
                    if(d.depth === 0) return "none";
                });
            nodeEnter
                .append("image")
                .attr("xlink:href", function(d){
                    if (d.class == "dataset"){
                        return config.getIconByDataset(d.name).path;
                    }else if(d.class == "operator"){
                        return config.getIconByOperation(d.name).path;
                    }
                })
                .attr("x", function(d){
                    if (d.class == "dataset"){
                        return config.getIconByDataset(d.name).width/-2;
                    }else if(d.class == "operator"){
                        return config.getIconByOperation(d.name).width/-2;
                    }
                })
                .attr("y", function(d){
                    if (d.class == "dataset"){
                        return config.getIconByDataset(d.name).height/-2;
                    }else if(d.class == "operator"){
                        return config.getIconByOperation(d.name).height/-2;
                    }
                })
                .attr("width", function(d){
                    if (d.class == "dataset"){
                        return config.getIconByDataset(d.name).width;
                    }else if(d.class == "operator"){
                        return config.getIconByOperation(d.name).width;
                    }
                })
                .attr("height", function(d){
                    if (d.class == "dataset"){
                        return config.getIconByDataset(d.name).height;
                    }else if(d.class == "operator"){
                        return config.getIconByOperation(d.name).height;
                    }
                });

            node.selectAll("text").remove();
            node.filter(function(d){ return d.highlighted && d.depth > 0; })
                .append("text")
                .text(function(d){
                    return d.name;
                })
                .attr("text-anchor", "middle")
                .attr("x", 0)
                .attr("y", function(d){
                    if(d.class == "dataset"){
                        return 45;
                    }else if(d.class == "operator"){
                        return 35;
                    }else{
                        return 20;
                    }
                });

            node.selectAll("circle").transition()
                .style("fill", function(d){
                    if(d.depth === 0){
                        return "none";
                    }else if(d.highlighted){
                        return colorScale(d.depth/5);
                    }else if(d.isOption){
                        return "#aaa";
                    }
                });

            //click events for option nodes
            //either "operator" or "parameter" node
            /*node.filter(function(d){ return d.isOption == true; })
                .on('click', function(d){
                    console.log('click');

                    d.parent.terminal = false;
                    d.terminal = true;
                    d.parent.children = []; //empty all other children except this one
                    console.log(d);
                    d.parent.children.push(d);
                    console.log(self.root);

                    self.graph();
                });*/

            node.exit()
                .remove();


            //draw, update or remove links
            var link = this.vis.selectAll("line.link")
                .data(this.links, function(d){ return d.target.id; });

            link.enter().insert("svg:line", ".node")
                .attr("class","link")
                .attr("x1", function(d){ return d.source.x; })
                .attr("y1", function(d){ return d.source.y; })
                .attr("x2", function(d){ return d.target.x; })
                .attr("y2", function(d){ return d.target.y; })
                .style("stroke", "none");

            link.transition()
                .style("stroke", function(d){
                    if(d.source.depth == 0){
                        return "none";
                    }else if(d.target.highlighted){
                        return colorScale(d.source.depth/5);
                    }else if(d.target.isOption){
                        return "#aaa";
                    }else{
                        return "#444";
                    }
                })
                .style("stroke-width", function(d){
                    if(d.target.highlighted){
                        return "5px";
                    }else{
                        return "2px";
                    }
                });

            link.exit().remove();



            function tick(e){

                /*
                var ky = .8 * e.alpha, kx = 1.4 * e.alpha;

                self.links.forEach(function (d, i) {
                    d.target.y += (d.source.y - d.target.y) * ky;
                    d.target.x += (d.source.x + 120 - d.target.x) * kx;
                });
                */

                link
                    .attr("x1", function(d){ return d.source.x; })
                    .attr("y1", function(d){ return d.source.y; })
                    .attr("x2", function(d){ return d.target.x; })
                    .attr("y2", function(d){ return d.target.y; });

                node
                    .attr("transform", function(d){
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }

        },

        toggleChildren: function(d){

            //TODO: deprecate this
            //turning d.children to d._children removes children from the tree graph
            if(d.children){
                d._children = d.children;
                d.children = null;
            }else if(d._children){
                d.children = d._children;
                d._children = null;
            }
        },

        findWorkflow: function(d){
            //workflows, if they exist, is stored in ._children property
            if(d._children){
                console.log("found workflow");
                console.log(d._children[0].leafID);

                //sync workflow
            }else{
                if(d.children) d.children.forEach(function(dd){ dd.isOption = true;});

                //show some kind of prompt
            }
        },

        renderFullGraph: function () {

            this.graph();

        }

    });


    //public api

    OperatorFlow.renderFlowItems = function (model) {
        //model => config.workflow

        var operatorFlowView = new OperatorFlowView({
            //model: model,
            //collection: model.get("mergedRepresentations")
        });

        //show this view in the parent layout
        vent.trigger('show:operatorFlowItems', operatorFlowView);

		//TODO: make it rain!
        //render the graph after the view is rendered
        //operatorFlowView.initGraph()
    };


    return OperatorFlow;

});