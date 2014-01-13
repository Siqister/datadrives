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
                              "name":"Singapore Airlines only",
                              "class":"parameter",
                              "children": [
                                  {name:"Singapore Airlines", class: "workflow", leafID: 1}
                              ]
                          },
                          {
                              "name":"Ethihad Airlines only",
                              "class":"parameter",
                              "children": [
                                  {name:"Ethihad Airlines", class:"workflow", leafID:2}
                              ]
                          }
                      ]
                    },
                    {
                        name:"Changi Airport Flights", class: "workflow", leafID:3
                    },
                    {
                      "name":"O-D",
                      "class":"operator",
                      "children":[
                          {name:"Changi Airport O-D", class:"workflow", leafID:4}
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
                                  {name:"By Origin City (Grouped)", class:"workflow", leafID:5},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"City 1 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 1", class:"workflow", leafID:6}
                                              ]
                                          },
                                          {
                                              name:"City 2 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 2", class:"workflow", leafID:7}
                                              ]
                                          },
                                          {
                                              name:"City 3 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 3", class:"workflow", leafID:8}
                                              ]
                                          },
                                          {
                                              name:"City 4 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 4", class:"workflow", leafID:9}
                                              ]
                                          },
                                          {
                                              name:"City 5 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 5", class:"workflow", leafID:10}
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
                                  {name:"By Destination City (Grouped)", class:"workflow", leafID:11},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"City 1 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 1", class:"workflow", leafID:12}
                                              ]
                                          },
                                          {
                                              name:"City 2 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 2", class:"workflow", leafID:13}
                                              ]
                                          },
                                          {
                                              name:"City 3 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 3", class:"workflow", leafID:14}
                                              ]
                                          },
                                          {
                                              name:"City 4 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 4", class:"workflow", leafID:15}
                                              ]
                                          },
                                          {
                                              name:"City 5 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"City 5", class:"workflow", leafID:16}
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
                                  {name:"By Airline (Grouped)", class:"workflow", leafID:17},
                                  {
                                      name:"Filter",
                                      class:"operator",
                                      children:[
                                          {
                                              name:"Airline 1 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 1", class:"workflow", leafID:18}
                                              ]
                                          },
                                          {
                                              name:"Airline 2 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 2", class:"workflow", leafID:19}
                                              ]
                                          },
                                          {
                                              name:"Airline 3 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 3", class:"workflow", leafID:20}
                                              ]
                                          },
                                          {
                                              name:"Airline 4 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 4", class:"workflow", leafID:21}
                                              ]
                                          },
                                          {
                                              name:"Airline 5 only",
                                              class:"parameter",
                                              children:[
                                                  {name:"Airline 5", class:"workflow", leafID:22}
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
                    {name:"Singapore Power (Original)", class:"workflow", leafID:23}
                ]
            },
            {
                "name":"NEA Rain Gauge Reading",
                "class": "dataset",
                "children":[
                    {name:"NEA Rain (Original)", class:"workflow", leafID:24},
                    {
                        name:"Group",
                        class:"operator",
                        children:[
                            {
                                name:"Into Spatial Grid",
                                class:"parameter",
                                children:[
                                    {name:"Spatial Grid", class:"workflow", leafID:25}
                                ]
                            },
                            {
                                name:"Into All of Singapore",
                                class:"parameter",
                                children:[
                                    {name:"All of Singapore", class:"workflow", leafID:26}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});