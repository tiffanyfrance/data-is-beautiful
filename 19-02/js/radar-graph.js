var physicalRadarData;

$(function() {
  let data = {
    physicalRadarData: [[
      {"axis": "Heroin", "value": 2.78, "yOffset": -10},
      {"axis": "Cocaine", "value": 2.33, "xOffset": -48, "yOffset": -5},
      {"axis": "Barbiturates", "value": 2.23, "xOffset": -75, "yOffset": -5},  
      {"axis": "Tobacco", "value": 1.9, "xOffset": -45, "yOffset": 0},  
      {"axis": "Alcohol", "value": 2.15, "xOffset": -40, "yOffset": 0},
      {"axis": "Street methadone", "value": 1.86, "xOffset": -102, "yOffset": -3},
      {"axis": "Ketamine", "value": 2, "xOffset": -55, "yOffset": -2},  
      {"axis": "Amphetamine", "value": 1.81, "xOffset": -85, "yOffset": -10},
      {"axis": "Benzodiazepines", "value": 1.63, "xOffset": -100, "yOffset": 0},
      {"axis": "4-MTA", "value": 2.15, "xOffset": -40, "yOffset": 0},
      {"axis": "Buprenorphine", "value": 1.6, "xOffset": 5, "yOffset": 0},  
      {"axis": "Cannabis", "value": 1.5, "xOffset": 55,"yOffset": 0},  
      {"axis": "Solvents", "value": 1.9, "xOffset": 50, "yOffset": 5},
      {"axis": "Ecstasy", "value": 1.6, "xOffset": 40, "yOffset": -5},
      {"axis": "Methylphenidate", "value": 1.32, "xOffset": 100, "yOffset": -5},  
      {"axis": "GHB", "value": 1.3, "xOffset": 20, "yOffset": 0},
      {"axis": "LSD", "value": 1.13, "xOffset": 20, "yOffset": 0},
      {"axis": "Anabolic steroids", "value": 1.45, "xOffset": 100, "yOffset": 0},
      {"axis": "Khat", "value": 0.75, "xOffset": 25, "yOffset": -10},  
      {"axis": "Alkyl nitrites", "value": 0.93, "xOffset": 70,"yOffset": -10}
    ]],
    dependenceRadarData: [[
      {"axis": "Heroin", "value": 3, "yOffset": -10},
      {"axis": "Cocaine", "value": 2.39, "xOffset": -48, "yOffset": -5},
      {"axis": "Barbiturates", "value": 2.01, "xOffset": -75, "yOffset": -5},  
      {"axis": "Tobacco", "value": 2.21, "xOffset": -45, "yOffset": 0},  
      {"axis": "Alcohol", "value": 1.93, "xOffset": -40, "yOffset": 0},
      {"axis": "Street methadone", "value": 2.08, "xOffset": -102, "yOffset": -3},
      {"axis": "Ketamine", "value": 1.54, "xOffset": -55, "yOffset": -2},  
      {"axis": "Amphetamine", "value": 1.67, "xOffset": -85, "yOffset": -10},
      {"axis": "Benzodiazepines", "value": 1.83, "xOffset": -100, "yOffset": 0},
      {"axis": "4-MTA", "value": 1.3, "xOffset": -40, "yOffset": 0},
      {"axis": "Buprenorphine", "value": 1.64, "xOffset": 5, "yOffset": 0},  
      {"axis": "Cannabis", "value": 1.51, "xOffset": 55,"yOffset": 0},  
      {"axis": "Solvents", "value": 1.01, "xOffset": 50, "yOffset": 5},
      {"axis": "Ecstasy", "value": 1.13, "xOffset": 40, "yOffset": -5},
      {"axis": "Methylphenidate", "value": 1.25, "xOffset": 100, "yOffset": -5},  
      {"axis": "GHB", "value": 1.19, "xOffset": 20, "yOffset": 0},
      {"axis": "LSD", "value": 1.23, "xOffset": 20, "yOffset": 0},
      {"axis": "Anabolic steroids", "value": 0.88, "xOffset": 100, "yOffset": 0},
      {"axis": "Khat", "value": 1.04, "xOffset": 25, "yOffset": -10},  
      {"axis": "Alkyl nitrites", "value": 0.87, "xOffset": 70,"yOffset": -10}
    ]],
    socialHarmRadarData: [[
      {"axis": "Heroin", "value": 2.54, "yOffset": -10},
      {"axis": "Cocaine", "value": 2.17, "xOffset": -48, "yOffset": -5},
      {"axis": "Barbiturates", "value": 2, "xOffset": -75, "yOffset": -5},  
      {"axis": "Tobacco", "value": 1.42, "xOffset": -45, "yOffset": 0},  
      {"axis": "Alcohol", "value": 2.21, "xOffset": -40, "yOffset": 0},
      {"axis": "Street methadone", "value": 1.87, "xOffset": -102, "yOffset": -3},
      {"axis": "Ketamine", "value": 1.69, "xOffset": -55, "yOffset": -2},  
      {"axis": "Amphetamine", "value": 1.5, "xOffset": -85, "yOffset": -10},
      {"axis": "Benzodiazepines", "value": 1.65, "xOffset": -100, "yOffset": 0},
      {"axis": "4-MTA", "value": 1.06, "xOffset": -40, "yOffset": 0},
      {"axis": "Buprenorphine", "value": 1.49, "xOffset": 5, "yOffset": 0},  
      {"axis": "Cannabis", "value": 1.5, "xOffset": 55,"yOffset": 0},  
      {"axis": "Solvents", "value": 1.52, "xOffset": 50, "yOffset": 5},
      {"axis": "Ecstasy", "value": 1.09, "xOffset": 40, "yOffset": -5},
      {"axis": "Methylphenidate", "value": 0.97, "xOffset": 100, "yOffset": -5},  
      {"axis": "GHB", "value": 1.3, "xOffset": 20, "yOffset": 0},
      {"axis": "LSD", "value": 1.32, "xOffset": 20, "yOffset": 0},
      {"axis": "Anabolic steroids", "value": 1.13, "xOffset": 100, "yOffset": 0},
      {"axis": "Khat", "value": 0.85, "xOffset": 25, "yOffset": -10},  
      {"axis": "Alkyl nitrites", "value": 0.97, "xOffset": 70,"yOffset": -10}
    ]],
    allRadarChart: [
      {
        className: 'physicalRadarData',
        axes: [
          {"axis": "Heroin", "value": 2.78, "yOffset": -10},
          {"axis": "Cocaine", "value": 2.33, "xOffset": -48, "yOffset": -5},
          {"axis": "Barbiturates", "value": 2.23, "xOffset": -75, "yOffset": -5},  
          {"axis": "Tobacco", "value": 1.9, "xOffset": -45, "yOffset": 0},  
          {"axis": "Alcohol", "value": 2.15, "xOffset": -40, "yOffset": 0},
          {"axis": "Street methadone", "value": 1.86, "xOffset": -102, "yOffset": -3},
          {"axis": "Ketamine", "value": 2, "xOffset": -55, "yOffset": -2},  
          {"axis": "Amphetamine", "value": 1.81, "xOffset": -85, "yOffset": -10},
          {"axis": "Benzodiazepines", "value": 1.63, "xOffset": -100, "yOffset": 0},
          {"axis": "4-MTA", "value": 2.15, "xOffset": -40, "yOffset": 0},
          {"axis": "Buprenorphine", "value": 1.6, "xOffset": 5, "yOffset": 0},  
          {"axis": "Cannabis", "value": 1.5, "xOffset": 55,"yOffset": 0},  
          {"axis": "Solvents", "value": 1.9, "xOffset": 50, "yOffset": 5},
          {"axis": "Ecstasy", "value": 1.6, "xOffset": 40, "yOffset": -5},
          {"axis": "Methylphenidate", "value": 1.32, "xOffset": 100, "yOffset": -5},  
          {"axis": "GHB", "value": 1.3, "xOffset": 20, "yOffset": 0},
          {"axis": "LSD", "value": 1.13, "xOffset": 20, "yOffset": 0},
          {"axis": "Anabolic steroids", "value": 1.45, "xOffset": 100, "yOffset": 0},
          {"axis": "Khat", "value": 0.75, "xOffset": 25, "yOffset": -10},  
          {"axis": "Alkyl nitrites", "value": 0.93, "xOffset": 70,"yOffset": -10}
        ]
      },
      {
        className: 'dependenceRadarData',
        axes: [
          {"axis": "Heroin", "value": 3, "yOffset": -10},
          {"axis": "Cocaine", "value": 2.39, "xOffset": -48, "yOffset": -5},
          {"axis": "Barbiturates", "value": 2.01, "xOffset": -75, "yOffset": -5},  
          {"axis": "Tobacco", "value": 2.21, "xOffset": -45, "yOffset": 0},  
          {"axis": "Alcohol", "value": 1.93, "xOffset": -40, "yOffset": 0},
          {"axis": "Street methadone", "value": 2.08, "xOffset": -102, "yOffset": -3},
          {"axis": "Ketamine", "value": 1.54, "xOffset": -55, "yOffset": -2},  
          {"axis": "Amphetamine", "value": 1.67, "xOffset": -85, "yOffset": -10},
          {"axis": "Benzodiazepines", "value": 1.83, "xOffset": -100, "yOffset": 0},
          {"axis": "4-MTA", "value": 1.3, "xOffset": -40, "yOffset": 0},
          {"axis": "Buprenorphine", "value": 1.64, "xOffset": 5, "yOffset": 0},  
          {"axis": "Cannabis", "value": 1.51, "xOffset": 55,"yOffset": 0},  
          {"axis": "Solvents", "value": 1.01, "xOffset": 50, "yOffset": 5},
          {"axis": "Ecstasy", "value": 1.13, "xOffset": 40, "yOffset": -5},
          {"axis": "Methylphenidate", "value": 1.25, "xOffset": 100, "yOffset": -5},  
          {"axis": "GHB", "value": 1.19, "xOffset": 20, "yOffset": 0},
          {"axis": "LSD", "value": 1.23, "xOffset": 20, "yOffset": 0},
          {"axis": "Anabolic steroids", "value": 0.88, "xOffset": 100, "yOffset": 0},
          {"axis": "Khat", "value": 1.04, "xOffset": 25, "yOffset": -10},  
          {"axis": "Alkyl nitrites", "value": 0.87, "xOffset": 70,"yOffset": -10}
        ]
      },
      {
        className: 'socialHarmRadarData',
        axes: [
          {"axis": "Heroin", "value": 2.54, "yOffset": -10},
          {"axis": "Cocaine", "value": 2.17, "xOffset": -48, "yOffset": -5},
          {"axis": "Barbiturates", "value": 2, "xOffset": -75, "yOffset": -5},  
          {"axis": "Tobacco", "value": 1.42, "xOffset": -45, "yOffset": 0},  
          {"axis": "Alcohol", "value": 2.21, "xOffset": -40, "yOffset": 0},
          {"axis": "Street methadone", "value": 1.87, "xOffset": -102, "yOffset": -3},
          {"axis": "Ketamine", "value": 1.69, "xOffset": -55, "yOffset": -2},  
          {"axis": "Amphetamine", "value": 1.5, "xOffset": -85, "yOffset": -10},
          {"axis": "Benzodiazepines", "value": 1.65, "xOffset": -100, "yOffset": 0},
          {"axis": "4-MTA", "value": 1.06, "xOffset": -40, "yOffset": 0},
          {"axis": "Buprenorphine", "value": 1.49, "xOffset": 5, "yOffset": 0},  
          {"axis": "Cannabis", "value": 1.5, "xOffset": 55,"yOffset": 0},  
          {"axis": "Solvents", "value": 1.52, "xOffset": 50, "yOffset": 5},
          {"axis": "Ecstasy", "value": 1.09, "xOffset": 40, "yOffset": -5},
          {"axis": "Methylphenidate", "value": 0.97, "xOffset": 100, "yOffset": -5},  
          {"axis": "GHB", "value": 1.3, "xOffset": 20, "yOffset": 0},
          {"axis": "LSD", "value": 1.32, "xOffset": 20, "yOffset": 0},
          {"axis": "Anabolic steroids", "value": 1.13, "xOffset": 100, "yOffset": 0},
          {"axis": "Khat", "value": 0.85, "xOffset": 25, "yOffset": -10},  
          {"axis": "Alkyl nitrites", "value": 0.97, "xOffset": 70,"yOffset": -10}
        ]
      }
    ]
  };

  RadarChart.defaultConfig.w = 600;
  RadarChart.defaultConfig.h = 600;
  RadarChart.defaultConfig.maxValue = 3.1;

  RadarChart.draw("#radarChart", data.physicalRadarData);
  RadarChart.draw("#radarChart2", data.dependenceRadarData);
  RadarChart.draw("#radarChart3", data.socialHarmRadarData);
  RadarChart.draw("#allRadarChart", data.allRadarChart);
});