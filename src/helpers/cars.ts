export class CarsHelper {

  static getCars() {
    const cars = [
      {
        "carro": "Ford Ka 1.0",
        "imagem": "https://i.imgur.com/42y1Qqi.jpeg",
        "ano": "1997",
        "preco": "R$6.226",
        "desvalorizacao": "4,24%",
        "propulsao": "Combustão",
        "combustivel": "Gasolina",
        "IPVA": "Isento2",
        "seguro": "Indisponível",
        "revisoes": "Preçosnãotabelados",
        "procedencia": "Nacional",
        "garantia": "1ano",
        "configuracao": "Hatch",
        "porte": "Subcompacto",
        "lugares": 4,
        "portas": 2,
        "geracao": 1,
        "plataforma": "Ford B",
        "indiceCNW": "58,42",
        "rankingCNW": "14961",
        "protecao_adulto": "34%",
        "protecao_infantil": "9%",
        "protecao_pedestre": "50%",
        "assitencia_seguranca": "7%",
        "motor": {
          "instalacao": "Dianteiro",
          "aspiracao": "Natural",
          "disposicao": "Transversal",
          "alimentacao": "Injeção multiponto",
          "cilindros": "4 em linha",
          "comando_valvulas": "Único no bloco",
          "cilindrada_unitaria": "250cm3",
          "acionamento": "Corrente",
          "valvulas_por_cilindro": 2,
          "diametro_cilindo": "68,7 mm",
          "razao_de_compressao": "9,2:1",
          "curso_pistao": "67,4 mm",
          "deslocamento": "999 cm3",
          "potencia_maxima": "53,5 cv a 5200 rpm",
          "codigodo_motor": "Endura",
          "torque_maximo": "7,86 kgfm a 4000 rpm",
          "peso_potencia": "17,01 kg/cv",
          "torque_especifico": "7,9 kgfm/l",
          "peso_torque": "115,8 kg/kgfm",
          "potencia_especifica": "53,6 cv/l",
        },
        "transmissao": {
          "tracao": "Dianteira",
          "cambio": "Manual 5 marchas",
          "codigodo_cambio": "IB5",
          "acoplamento": "Embreagem monodisco a seco",
        },
        "suspensao": {
          "dianteira": "Independente, McPherson",
          "elemento_elastico_dianteiro": "Mola Elicoidal",
          "traseira": "Eixo de torção",
          "elemento_elastico_traseiro": "Mola Elicoidal"
        },
        "freios": {
          "dianteiros": "Disco sólido",
          "traseiro": "tambor"
        },
        "direcao": {
          "assistencia": "Não assistida",
          "diametro_de_giro": "10,3 m"
        },
        "pneus": {
          "aianteiros": "145/80R13",
          "altura_flanco_dianteiro": "116 mm",
          "traseiros": "145/80R13",
          "altura_flanco_traseiro": "116 mm",
        },
        "dimensoes": {
          "comprimento": "3624 mm",
          "largura": "16,31 mm",
          "distancia_entre_eixos": "2446 mm",
          "altura": "1368 mm",
          "porta_malas": "186 litros",
          "tanque_combustivel": "42 litros",
          "Peso": "910 kg"
        },
        "aerodinamica": {
          "area_frontal_a": "1,9 m2",
          "coef_arrasto": "0,43",
          "area_frontal_corrigida": "0,817 m2"
        },
        "desempenho": {
          "velocidade_maxima": "142km/h",
          "aceleracao": {
            "zero_cem": "19 s"
          }
        },
        "consumo": {
          "urbano": "12,7 km/l",
          "rodoviario": "16,8 km/l"
        },
        "autonomia": {
          "urbana": "533 km",
          "rodoviaria": "706 km",
        }
      },
      {
        "carro": "Virtus 1.6 2019",
        "imagem": "https://i.imgur.com/ZO1CtZy.jpeg",
        "marca": "Volkswagen",
        "modelo": "Virtus",
        "versao": "1.6 2019",
        "combustível": "Flex - Etanol e/ou Gasolina",
        "origem": "Nacional",
        "categoria": "Sedã",
        "portas": "4",
        "ocupantes": "5",
        "plataforma": "MQB",
        "garantia": "3 anos"
      }

    ]



    return cars;
  }
}
