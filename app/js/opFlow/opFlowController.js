// note for brevity this controller also contains the definition of the router for this sub-app/module
define([
    'underscoreM',
    'marionette',
    'vent',
    'templates',

    'opFlow/models/workflowRender',
    'opFlow/models/systemOperator',
    'opFlow/models/workflowTime',
    'app/models/execution',
    'app/models/user',

    //'opFlow/views/operatorList',
    'opFlow/views/operatorFlow',
    
    //'app/models/systemDataset',

    'config'
    ], 
function(
    _,
    Marionette,
    vent,
    templates,
    
    WorkflowRenderModel,
    SystemOperatorModel,
   	WorkflowTimeModel,
    ExecutionModel,
    UserModel,

    //OperatorListView,
    OperatorFlowView,

    //SystemDatasetModel,

    config
) {

    var Controller = {};

    Controller.Router = Marionette.AppRouter.extend({
        appRoutes: {
            "workflow/:workflowID":"loadWorkFlow"
        }
    });

   // private: render layout
    var Layout = Marionette.Layout.extend({
        template: _.template(templates.opVizActions),
        id: "workflow-container",
        regions: {
            operatorFlow: "#operator-flow",
        }
    });

    var _initializeLayout = function() {
        Controller.layout = new Layout();
        vent.trigger('app:show:opFlow', Controller.layout);
    };
    
    
    vent.on('show:operatorFlowItems', function(operatorFlowView){
    	//triggered by operatorFlowView after the view has been created
    	Controller.layout.operatorFlow.show(operatorFlowView);
    });

    //public api for routers etc    
    Controller.loadWorkFlow = function(workflowId) {

        //initialize datamodels
        //config.systemOperators = new SystemOperatorModel();
        //config.systemDatasets = new SystemDatasetModel();

        //workflow needs system datasets and system operators first
        /*$.when(config.systemOperators.deferred, config.systemDatasets.deferred).then(function() {
			
            config.workflow = new WorkflowRenderModel({id:workflowId});

            $.when(
                config.user,
                config.workflow.deferred
            )
            .then(function() {
				//new WorkflowTimeModel.timeRange();
				//new WorkflowTimeModel.timeAggregation();

				//vizBuilderController.loadManager(config.workflow);
				//Add datasets to conveyor after systemDatasets have fetched

				OperatorFlowView.renderFlowItems(config.workflow);
            });
        });*/

        this.renderOperatorFlow();
        OperatorFlowView.renderFlowItems();

    };
    
    Controller.renderOperatorFlow = function() {
        _initializeLayout();
    };

    return Controller;
});