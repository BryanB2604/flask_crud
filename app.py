from flask import Flask, redirect, render_template, request, url_for, jsonify
import mysql.connector

conexion = mysql.connector.connect(
    host = "127.0.0.1",
    user = "root",
    password = "",
    database="jugadores_db"
)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mostrar', methods = ['GET'])
def mostrar():
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM jugador')
    jugadores = cursor.fetchall() 
    cursor.close()
    return render_template('index.html', jugadores = jugadores)


@app.route('/ingresar', methods=['POST'])
def ingresar_informacion():
        # Trae los datos 
        data1 = request.get_json() #los da en formato json
        nombre = data1['nombre']
        cedula = data1['cedula']
        edad = data1['edad']
        nacionalidad = data1['nacionalidad']

        cursor = conexion.cursor()
        cursor.execute('INSERT INTO jugador (nombre, cedula, edad, nacionalidad) VALUES (%s, %s, %s, %s)', (nombre, cedula, edad, nacionalidad))
        conexion.commit()
        cursor.close()
        return redirect(url_for('index'))

@app.route('/eliminar', methods=['DELETE'])
def eliminar_informacion():
        data1 = request.get_json()
        cedula = data1['cedula']

        cursor = conexion.cursor()
        cursor.execute('DELETE FROM jugador WHERE cedula = %s', (cedula,))
        conexion.commit()
        cursor.close()
        return redirect(url_for('index'))

@app.route('/actualizar', methods=['PUT'])
def actualizar_informacion():
    data1 = request.get_json()
    nombre = data1['nombre']
    cedula = data1['cedula']
    edad = data1['edad']
    nacionalidad = data1['nacionalidad']
    
    cursor = conexion.cursor()
    cursor.execute('UPDATE jugador SET nombre = %s, edad = %s, nacionalidad = %s WHERE cedula = %s',
                   (nombre, edad, nacionalidad, cedula))
    
    conexion.commit()
    cursor.close()

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug = True)