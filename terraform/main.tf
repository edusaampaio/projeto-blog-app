provider "aws" {
  region = "us-west-2"  # Altere para a sua região
}

resource "aws_instance" "blog_instance" {
  ami           = "ami-0c55b159cbfafe1f0"  # Substitua pelo ID da sua AMI (imagem)
  instance_type = "t2.micro"               # Tipo da instância (modifique conforme necessário)

  # Chave SSH para acessar a instância (se tiver configurada)
  key_name = "your-ssh-key-name"  # Substitua pelo nome da chave SSH

  tags = {
    Name = "BlogApp-EC2"
  }
}
