IF OBJECT_ID(N'dbo.Musicas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Musicas (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        titulo NVARCHAR(120) NOT NULL,
        artista NVARCHAR(120) NOT NULL,
        genero NVARCHAR(60) NOT NULL,
        ano_lancamento SMALLINT NOT NULL
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Musicas)
BEGIN
    INSERT INTO dbo.Musicas (titulo, artista, genero, ano_lancamento) VALUES
        (N'Águas de Março', N'Elis Regina e Tom Jobim', N'MPB', 1974),
        (N'Asa Branca', N'Luiz Gonzaga', N'Baião', 1947),
        (N'Trem das Onze', N'Demônios da Garoa', N'Samba', 1964),
        (N'Mas Que Nada', N'Jorge Ben Jor', N'Samba rock', 1963),
        (N'O Bêbado e a Equilibrista', N'Elis Regina', N'MPB', 1979);
END;
GO

SELECT id, titulo, artista, genero, ano_lancamento
FROM dbo.Musicas
ORDER BY id;
GO
