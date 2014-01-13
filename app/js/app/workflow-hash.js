define([], function(){
    return {
        "name":"all datasets",
        "children": [
            {
                "name":"Changi Airport",
                "class": "dataset",
                "children":[
                    {
                      "name":"Filter",
                      "class": "operator",
                      "children":[
                          {
                              "name":"Singapore Airlines",
                              "class":"parameter",
                              "children": [
                                  {name:"Singapore Airlines", class: "dataset", workflowID: 1}
                              ]
                          },
                          {
                              "name":"Ethihad Airlines",
                              "class":"parameter",
                              "children": [
                                  {name:"Ethihad Airlines", class:"dataset", workflowID:2}
                              ]
                          }
                      ]
                    },
                    {
                        name:"Changi Airport", class: "dataset", workflowID:3
                    },
                    {
                      "name":"O-D",
                      "class":"operator",
                      "children":[
                          {name:"Changi Airport O-D", class:"dataset", workflowID:4}
                      ]
                    },
                    {
                      "name":"Group",
                      "class":"operator",
                      "children":[
                          {
                              "name":"By Origin City",
                              "class":"parameter",
                              "children":[
                                  {name:"By Origin City (Grouped)", class:"dataset", workflowID:5},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"City 1",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 1", class:"dataset", workflowID:6}
                                              ]
                                          },
                                          {
                                              name:"City 2",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 2", class:"dataset", workflowID:7}
                                              ]
                                          },
                                          {
                                              name:"City 3",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 3", class:"dataset", workflowID:8}
                                              ]
                                          },
                                          {
                                              name:"City 4",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 4", class:"dataset", workflowID:9}
                                              ]
                                          },
                                          {
                                              name:"City 5",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 5", class:"dataset", workflowID:10}
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          },
                          {
                              "name":"By Destination City",
                              "class":"parameter",
                              "children":[
                                  {name:"By Destination City (Grouped)", class:"dataset", workflowID:11},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"City 1",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 1", class:"dataset", workflowID:12}
                                              ]
                                          },
                                          {
                                              name:"City 2",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 2", class:"dataset", workflowID:13}
                                              ]
                                          },
                                          {
                                              name:"City 3",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 3", class:"dataset", workflowID:14}
                                              ]
                                          },
                                          {
                                              name:"City 4",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 4", class:"dataset", workflowID:15}
                                              ]
                                          },
                                          {
                                              name:"City 5",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 5", class:"dataset", workflowID:16}
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          },
                          {
                              "name":"By Airline",
                              "class":"parameter",
                              "children":[
                                  {name:"By Airline (Grouped)", class:"dataset", workflowID:17},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"Airline 1",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 1", class:"dataset", workflowID:18}
                                              ]
                                          },
                                          {
                                              name:"Airline 2",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 2", class:"dataset", workflowID:19}
                                              ]
                                          },
                                          {
                                              name:"Airline 3",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 3", class:"dataset", workflowID:20}
                                              ]
                                          },
                                          {
                                              name:"Airline 4",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 4", class:"dataset", workflowID:21}
                                              ]
                                          },
                                          {
                                              name:"Airline 5",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 5", class:"dataset", workflowID:22}
                                              ]
                                          }
                                      ]
                                  }
                              ]
                          }
                      ]
                    }
                ]
            },
            {
                "name":"Singapore Power",
                "class": "dataset",
                "children":[
                    {name:"Singapore Power (Original)", class:"dataset", workflowID:23}
                ]
            },
            {
                "name":"NEA Rain Gauge Reading",
                "class": "dataset",
                "children":[
                    {name:"NEA Rain (Original)", class:"dataset", workflowID:24},
                    {
                        name:"Group",
                        class:"operator",
                        children:[
                            {
                                name:"Into Spatial Grid",
                                class:"parameter",
                                children:[
                                    {name:"Spatial Grid", class:"dataset", workflowID:25}
                                ]
                            },
                            {
                                name:"Into All of Singapore",
                                class:"parameter",
                                children:[
                                    {name:"All of Singapore", class:"dataset", workflowID:26}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});