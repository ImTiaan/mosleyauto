# GTA V Vehicle Manufacturers and Models

This document provides a comprehensive list of vehicle manufacturers and their models from Grand Theft Auto V, organized to facilitate easier selection and filtering in the Mosley Auto inventory system.

## Table of Contents
- [Introduction](#introduction)
- [Key Manufacturers](#key-manufacturers)
- [Vehicle Categories](#vehicle-categories)
- [Implementation Notes](#implementation-notes)

## Introduction

Grand Theft Auto V features a wide variety of vehicles based on real-world counterparts but with fictional names and manufacturers. This document organizes these vehicles by manufacturer to make it easier to implement a filtering system where selecting a manufacturer will show only their vehicles.

## Key Manufacturers

### Albany (Based on Cadillac)
- Emperor - 1970s-1980s Cadillac sedans
- Primo - 1990s Cadillac/Chevrolet sedans
- Buccaneer - 1970s Cadillac Eldorado
- Cavalcade - Cadillac Escalade
- Virgo - 1970s-80s Cadillac/Lincoln
- Washington - 2000s Cadillac/Lincoln sedan

### Annis (Based on Nissan)
- Elegy RH8 - Nissan GT-R (R35)
- Elegy Retro Custom - Nissan Skyline GT-R (R32/R33)
- Euros - Nissan 300ZX
- RE-7B - Nissan R90C race car
- ZR350 - Mazda RX-7

### Benefactor (Based on Mercedes-Benz)
- Dubsta - Mercedes-Benz G-Class
- Glendale - Mercedes-Benz W115
- Schafter - Mercedes-Benz E-Class
- Stirling GT - Mercedes-Benz 300SL Gullwing
- XLS - Mercedes-Benz GL-Class

### BF (Based on Volkswagen)
- Bifta - VW-based dune buggy
- Dune Buggy - VW-based dune buggy
- Injection - VW Baja Bug
- Surfer - Volkswagen Type 2
- Weevil - Volkswagen Beetle
- Weevil Custom - Modified VW Beetle

### Bravado (Based on Dodge)
- Banshee - Dodge Viper
- Buffalo - Dodge Charger
- Gauntlet - Dodge Challenger
- Gauntlet Hellfire - Dodge Challenger Hellcat
- Rumpo - Dodge Ram Van
- Youga - Dodge A100

### Declasse (Based on Chevrolet)
- Impaler - Chevrolet Impala (1960s)
- Moonbeam - Chevrolet Astro/GMC Safari
- Sabre GT - Chevrolet Chevelle SS
- Tampa - Chevrolet Chevelle
- Tornado - 1950s Chevrolet Bel Air
- Vamos - Chevrolet Nova
- Vigero - Chevrolet Camaro (1969)
- Yosemite - Chevrolet C10

### Dewbauchee (Based on Aston Martin)
- JB 700 - Aston Martin DB5
- Massacro - Aston Martin Vanquish
- Rapid GT - Aston Martin V8 Vantage
- Seven-70 - Aston Martin One-77
- Vagner - Aston Martin Valkyrie

### Grotti (Based on Ferrari)
- Carbonizzare - Ferrari California
- Cheetah - Ferrari Enzo
- Furia - Ferrari F8 Tributo
- Itali GTO - Ferrari 812 Superfast
- Turismo R - Ferrari LaFerrari
- X80 Proto - Ferrari F80 concept

### Imponte (Based on Pontiac)
- Deluxo - DeLorean DMC-12
- Dukes - Pontiac GTO
- Nightshade - Pontiac Firebird
- Phoenix - Pontiac Firebird Trans Am
- Ruiner - Pontiac Firebird/Trans Am

### Karin (Based on Toyota/Subaru)
- BeeJay XL - Toyota FJ Cruiser
- Futo - Toyota AE86 Trueno
- Kuruma - Mitsubishi Lancer Evolution X
- Sultan - Subaru Impreza WRX
- Sultan Classic - Subaru Impreza 22B

### Pegassi (Based on Lamborghini)
- Infernus - Lamborghini Murcielago
- Monroe - Lamborghini Miura
- Tempesta - Lamborghini Huracan
- Torero - Lamborghini Countach
- Zentorno - Lamborghini Sesto Elemento

### Pfister (Based on Porsche)
- Comet - Porsche 911
- Comet Retro Custom - Porsche 911 (classic)
- Comet Safari - Porsche 911 Safari
- Neon - Porsche Taycan
- 811 - Porsche 918 Spyder

### Ubermacht (Based on BMW)
- Oracle - BMW 7 Series
- Rebla GTS - BMW X5
- Sentinel - BMW 3 Series
- Zion - BMW 6 Series
- Zion Cabrio - BMW 6 Series Convertible

### Vapid (Based on Ford)
- Bullet - Ford GT
- Dominator - Ford Mustang
- Flash GT - Ford Focus RS
- Sandking - Ford F-150 Raptor
- Stanier - Ford Crown Victoria

## Vehicle Categories

GTA V vehicles are divided into several categories:

- Compact
- Coupe
- Muscle
- Off-road
- Sedan
- Sports
- Sports Classic
- Super
- SUV
- Utility
- Van

## Implementation Notes

When implementing the manufacturer-based filtering system:

1. Create a dropdown for manufacturers
2. When a manufacturer is selected, filter the model dropdown to only show vehicles from that manufacturer
3. Store the manufacturer-model relationships in a structured format (JSON or database)
4. Include vehicle specifications (top speed, acceleration, handling) where relevant