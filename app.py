from flask import Flask, redirect, request, jsonify, render_template, url_for
import mysql.connector

app = Flask(__name__)

def conectar_db():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="jugadores_db"
    )

# Ruta para mostrar la página principal
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/mostrar', methods=['GET'])
def mostrar():
    conexion = conectar_db()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jugador")
    jugadores = cursor.fetchall()
    conexion.close()
    return jsonify(jugadores)

@app.route('/ingresar', methods=['POST'])
def ingresar():
    datos = request.json
    conexion = conectar_db()
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO jugador (nombre, cedula, edad, nacionalidad) VALUES (%s, %s, %s, %s)", 
                   (datos['nombre'], datos['cedula'], datos['edad'], datos['nacionalidad']))
    conexion.commit()
    conexion.close()
    return jsonify({"mensaje": "Jugador agregado correctamente"})

@app.route('/eliminar', methods=['DELETE'])
def eliminar():
    datos = request.json
    conexion = conectar_db()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM jugador WHERE cedula = %s", (datos['cedula'],))
    conexion.commit()
    conexion.close()
    return jsonify({"mensaje": "Jugador eliminado correctamente"})

@app.route('/actualizar', methods=['PUT'])
def actualizar():
    datos = request.json
    print("Datos recibidos:", datos)
    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("SELECT * FROM jugador WHERE cedula = %s", (datos['cedula'],))
    if cursor.fetchone() is None:
        return jsonify({"mensaje": "Jugador no encontrado"})

    cursor.execute("UPDATE jugador SET nombre = %s, edad = %s, nacionalidad = %s WHERE cedula = %s",
                   (datos['nombre'], datos['edad'], datos['nacionalidad'], datos['cedula']))
    conexion.commit()
    conexion.close()
        
    return jsonify({"mensaje": "Jugador actualizado correctamente"})

@app.route('/estadisticas', methods=['GET'])
def estadisticas():
    conexion = conectar_db()
    cursor = conexion.cursor()

    cursor.execute("SELECT COUNT(*) FROM jugador")
    num_jugadores = cursor.fetchone()[0]  

    cursor.execute("SELECT AVG(edad) FROM jugador")
    promedio_edad = cursor.fetchone()[0]  

    cursor.execute("SELECT nacionalidad, COUNT(*) FROM jugador GROUP BY nacionalidad ORDER BY COUNT(*) DESC LIMIT 1")
    nacionalidad_mas_comun = cursor.fetchone()  

    conexion.close()

    return jsonify({
        "num_jugadores": num_jugadores,
        "promedio_edad": round(promedio_edad, 2) if promedio_edad else 0,
        "nacionalidad_mas_repetida": nacionalidad_mas_comun[0] if nacionalidad_mas_comun else "N/A"
    })

if __name__ == '__main__':
    app.run(debug=True)