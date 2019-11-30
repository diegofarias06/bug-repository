    
    calendar_chart({'value': 'HIVE'});

    function calendar_chart(selectObject) {

        // d3 = requirejs(['d3']);
        // require(["https://d3js.org/d3.v5.min.js"], function (d3) {
        var type_chart = selectObject.value; 
        if (type_chart == 'HIVE') {
            var file_name =  "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/teste_calendario.csv";
        } else if (type_chart == 'spark') {
            var file_name =  "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/teste_calendario.csv";
        } else if (type_chart == 'hbase') {
            var file_name =  "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/teste_calendario.csv";
        } else if (type_chart == 'cassandra') {
            var file_name =  "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/teste_calendario.csv";
        }else if (type_chart == 'camel') {
            var file_name =  "https://raw.githubusercontent.com/diegofarias06/bug-repository/master/teste_calendario.csv";
        }


        var formatDate1 = d3.time.format('%Y-%m-%d');
        var formatDate2 = d3.time.format('%d/%m/%Y');
        var formatP = d3.format('.1f');
        // var dias = {1: 'Seg', 2: 'Ter', 3: 'Quar', 4: 'Qui', 5: 'Sex', 6: 'Sab', 0: };
        var dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

        function chordTip (d) {


                // if (type_chart == 'rides_per_day') {
                //     return    `<strong>Data: ${formatDate2(d.dia)} (${dias[d.dia.getDay()]}) </strong><br /><div id='viagens_dia'></div><hr />
                //                    Total: ${total} <br />
                //                    Masculino: ${d.Men} (${formatP(pM)}%)<br />
                //                    Feminino: ${d.Women} (${formatP(pW)}%)<br />
                //                    Outros: ${d.Others} (${pO == 0? 0.0:formatP(pO)}%)`;
                // } else if (type_chart == 'avg_ride_per_day') {
                //     return    `<strong>Data: ${formatDate2(d.dia)} (${dias[d.dia.getDay()]}) </strong><br /><div id='viagens_dia'></div><hr />
                //                    Média: ${d.avg} <br />
                //                    Masculino: ${d.Men} (${formatP(pM)}%)<br />
                //                    Feminino: ${d.Women} (${formatP(pW)}%)<br />
                //                    Outros: ${d.Others} (${pO == 0? 0.0:formatP(pO)}%)`;
                // } else if (type_chart == 'rides_per_station') {
                //     return    `<strong>Data: ${formatDate2(d.dia)} (${dias[d.dia.getDay()]}) </strong><br /><div id='viagens_dia'></div><hr />
                //                    Total: ${total} <br />
                //                    Masculino: ${d.Men} (${formatP(pM)}%)<br />
                //                    Feminino: ${d.Women} (${formatP(pW)}%)<br />
                //                    Outros: ${d.Others} (${pO == 0? 0.0:formatP(pO)}%)`;
                // }

                // return    `<strong>Data: ${formatDate2(d.dia)} (${dias[d.dia.getDay()]}) </strong><br /><div id='viagens_dia'></div><hr />
                //                    Total: ${total} <br />
                //                    Masculino: ${d.Men} (${formatP(pM)}%)<br />
                //                    Feminino: ${d.Women} (${formatP(pW)}%)<br />
                //                    Outros: ${d.Others} (${pO == 0? 0.0:formatP(pO)}%)`;

                // total = d.x + d.y;
                // pM = 100 * (d.x / total);
                // pF = 100 * (d.y / total);
                // if (pM > pF) {
                //     return   `<strong>Data: ${formatDate(d.date)}</strong><br />
                //                       Total: ${d.x + d.y} <br />
                //                       Masculino: ${d.x} (${formatP(pM)}%)<br />
                //                       Feminino: ${d.y} (${formatP(pF)}%)`;
                // } else {
                //     return   `<strong>Data: ${formatDate(d.date)}</strong><br />
                //                       Total: ${d.x + d.y} <br />
                //                       Feminino: ${d.y} (${formatP(pF)}%)<br />
                //                       Masculino: ${d.x} (${formatP(pM)}%)`;
                // }
            }
        // var title="Número de viagens ao longo dos anos";
        var title="";
        var units=" Bugs Por Dia";

        if (type_chart == 'empresa_1') {
            var breaks = [1, 4, 7, 10, 13];
        } else if (type_chart == 'avg_ride_per_day') {
            var breaks = [10,20,30,50,100];
        } else if (type_chart == 'rides_per_station') {
            var breaks = [10,15,25,35,50];
        }


        // var breaks = type == 'count'? [500,1000,1500,2000,2500] : [10,20,50,100,400];

        // var breaks=[10,20,50,100,400];
        // var colours=["#FFFFCC","#C7E9B4","#7FCDBB","#41B6C4","#2C7FB8","#253494"];
        // var colours=["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f","#006d2c"];
        var colours=["#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"]

        //general layout information
        var cellSize = 17;
        var xOffset=30;
        var yOffset=60;
        var calY=50;//offset of calendar in each group
        var calX=25;
        var width = 960;
        var height = 150;
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        format = d3.time.format("%Y-%m-%dd");
        toolDate = d3.time.format("%Y-%m-%d");
        
        d3.csv(file_name, function(error, data) {
        // d3.csv("data/avg_time_ride_day.csv", function(error, data) {
            
            //set up an array of all the dates in the data which we need to work out the range of the data
            var dates = new Array();
            var values = new Array();
            var median = d3.format(".2f");
            //parse the data
            console.log(data)
            data.forEach(function(d)    {
                    dates.push(parseDate(d.date));
                    d.dia=parseDate(d.date);
                    d.year=d.dia.getFullYear();//extract the year from the data


                    // d.Men=parseInt(d.M_0);
                    // d.Women=parseInt(d.F_0);
                    // d.Others=parseInt(d.O_0);
            });
            
            var yearlyData = d3.nest()
                .key(function(d){return d.year;})
                .entries(data);
            
            d3.selectAll("#calendar_viagens > *").remove()

            var heigthSize = yearlyData.length * 210
            var svg = d3.selectAll("#calendar_viagens").append("svg")
                .attr("width","100%")
                .attr("viewBox","0 0 "+(xOffset+width)+" " + heigthSize.toString())
                
            //title
            svg.append("text")
            .attr("x",xOffset)
            .attr("y",20)
            .text(title);        

            
            //create an SVG group for each year
            var cals = svg.selectAll("g")
                .data(yearlyData)
                .enter()
                .append("g")
                .attr("id",function(d){
                    return d.key;
                })
                .attr("transform",function(d,i){
                    return "translate(0,"+(yOffset+(i*(height+calY)))+")";  
                })
            
            var labels = cals.append("text")
                .attr("class","yearLabel")
                .attr("x",xOffset)
                .attr("y",15)
                .text(function(d){return d.key});
            
            //create a daily rectangle for each year
            var rects = cals.append("g")
                .attr("id","alldays")
                .selectAll(".day")
                .data(function(d) { return d3.time.days(new Date(parseInt(d.key), 0, 1), new Date(parseInt(d.key) + 1, 0, 1)); })
                .enter().append("rect")
                .attr("id",function(d) {
                    return "_"+format(d);
                })
                .attr("class", "day")
                .attr("width", cellSize)
                .attr("height", cellSize)
                .attr("x", function(d) {
                    return xOffset+calX+(d3.time.weekOfYear(d) * cellSize);
                })
                .attr("y", function(d) { return calY+(d.getDay() * cellSize); })
                .datum(format);
            
            //create day labels
            // var days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
            var days = ['D','S','T','Q','Q','S','S'];
            var dayLabels=cals.append("g").attr("id","dayLabels")
            days.forEach(function(d,i)    {
                dayLabels.append("text")
                .attr("class","dayLabel")
                .attr("x","3.5em")
                .attr("y",function(d) { return calY+(i * cellSize); })
                .attr("dy","1em")
                .text(d);
            })
            
            //let's draw the data on
            var dataRects = cals.append("g")
                .attr("id","dataDays")
                .selectAll(".dataday")
                .data(function(d){
                    return d.values;   
                })
                .enter()
                .append("rect")
                .attr("id",function(d) {
                    return format(d.dia)+":"+d.Men;
                })
                .attr("stroke","#fff")
                .attr("width",cellSize)
                .attr("height",cellSize)
                .attr("x", function(d){return xOffset+calX+(d3.time.weekOfYear(d.dia) * cellSize);})
                .attr("y", function(d) { return calY+(d.dia.getDay() * cellSize); })
                .attr("fill", function(d) {
                    // sum = (d.Men + d.Women + d.Others);


                    if (type_chart == 'empresa_1') {
                        sum = d.value;
                    } else if (type_chart == 'avg_ride_per_day') {
                        sum = d.avg;
                    } else if (type_chart == 'rides_per_station') {
                        sum = (d.Men + d.Women + d.Others) / 3;
                    }


                    if (sum<=0) {
                        return "#FFFFFF";
                    }
                    for (i=0;i<breaks.length+1;i++){
                        if (sum<=breaks[i]){
                            return colours[i];
                        }
                    }
                    if (sum>breaks[4]){
                        return colours[breaks.length]   
                    }
                })
            dataRects.on("mouseover", function (d) {
                        d3.select(this)
                          .attr("stroke", "#fff")
                          .attr("stroke-width", 3);
                        d3.select(".tooltipleft")
                          .style("visibility", "visible")
                          .html(chordTip(d))
                          .style("top", function () { return (d3.event.pageY - 150)+"px"})
                          .style("left", function () { return (d3.event.pageX - 150)+"px";});

                     })
                     .on("mouseout", function (d) {
                        d3.select(this)
                          .attr("stroke", "#FFF")
                          .attr("stroke-width", 1);
                        d3.select(".tooltipleft").style("visibility", "hidden");
                     })


            //append a title element to give basic mouseover info
            dataRects.append("title")
                .text(function(d) { return toolDate(d.dia)+"\nNúmero de Bugs: "+d.value;});
            
            // dataRects.on("mouseover", function(d){
            //     d3.select(this)
            //       .attr("stroke", "#FFF")
            //       .attr("stroke-width", 2);
            // });

            //add montly outlines for calendar
            cals.append("g")
            .attr("id","monthOutlines")
            .selectAll(".month")
            .data(function(d) { 
                return d3.time.months(new Date(parseInt(d.key), 0, 1),
                                      new Date(parseInt(d.key) + 1, 0, 1)); 
            })
            .enter().append("path")
            .attr("class", "month")
            .attr("transform","translate("+(xOffset+calX)+","+calY+")")
            .attr("d", monthPath);
            
            //retreive the bounding boxes of the outlines
            var BB = new Array();
            var mp = document.getElementById("monthOutlines").childNodes;
            for (var i=0;i<mp.length;i++){
                BB.push(mp[i].getBBox());
            }
            
            var monthX = new Array();
            BB.forEach(function(d,i){
                boxCentre = d.width/2;
                monthX.push(xOffset+calX+d.x+boxCentre);
            })

            //create centred month labels around the bounding box of each month path
            //create day labels
            // var months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
            // var months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
            var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
            var monthLabels=cals.append("g").attr("id","monthLabels")
            months.forEach(function(d,i)    {
                monthLabels.append("text")
                .attr("class","monthLabel")
                .attr("x",monthX[i])
                .attr("y",calY/1.2)
                .text(d);
            })
            
             //create key
            var key = svg.append("g")
                .attr("id","key")
                .attr("class","key")
                .attr("transform",function(d){
                    return "translate("+xOffset+","+(yOffset-(cellSize*1.5))+")";
                });
            
            key.selectAll("rect")
                .data(colours)
                .enter()
                .append("rect")
                .attr("width",cellSize)
                .attr("height",cellSize)
                .attr("x",function(d,i){
                    return i*130;
                })
                .attr("fill",function(d){
                    return d;
                });
            
            key.selectAll("text")
                .data(colours)
                .enter()
                .append("text")
                .attr("x",function(d,i){
                    return cellSize+5+(i*130);
                })
                .attr("y","1em")
                .text(function(d,i){
                    if (i<colours.length-1){
                        return "até "+breaks[i];
                    }   else    {
                        return "acima de "+breaks[i-1];   
                    }
                });
            
        });//end data load
        
        //pure Bostock - compute and return monthly path data for any year
        function monthPath(t0) {
          var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
              d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
              d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
          return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
              + "H" + w0 * cellSize + "V" + 7 * cellSize
              + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
              + "H" + (w1 + 1) * cellSize + "V" + 0
              + "H" + (w0 + 1) * cellSize + "Z";
        }
    // });
}    